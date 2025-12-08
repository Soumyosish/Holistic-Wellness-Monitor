import { google } from "googleapis";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
export const getGoogleAuthUrl = async (req, res) => {
  try {
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const REDIRECT_URI =
      process.env.GOOGLE_REDIRECT_URI ||
      `${req.protocol}://${req.get("host")}/api/auth/google/callback`;
    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.error("getGoogleAuthUrl missing GOOGLE_CLIENT_ID/SECRET");
      return res
        .status(500)
        .json({ msg: "Server Google OAuth not configured" });
    }
    const oauth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    );
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ["openid", "profile", "email"],
    });
    res.json({ url });
  } catch (err) {
    console.error("getGoogleAuthUrl error:", err);
    res.status(500).json({ msg: err.message });
  }
};
export const googleCallback = async (req, res) => {
  try {
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const REDIRECT_URI = `${FRONTEND_URL.replace(
      /\/$/,
      ""
    )}/auth/google/callback`;
    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.error("googleCallback missing GOOGLE_CLIENT_ID/SECRET");
      return res.status(500).send("Server not configured for Google OAuth");
    }
    const code = req.query.code;
    if (!code) return res.status(400).send("Code missing");
    const oauth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    );
    const { tokens } = await oauth2Client.getToken({
      code,
      redirect_uri: REDIRECT_URI,
    });
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
    const { data } = await oauth2.userinfo.get();
    const { email, name, sub: googleId, picture } = data;
    if (!email) return res.status(400).send("Email not available from Google");
    let user = await User.findOne({ $or: [{ googleId }, { email }] });
    if (!user) {
      const rand = Math.random().toString(36).slice(-12);
      const hashed = await bcrypt.hash(rand, 10);
      user = await User.create({
        name: name || "Google User",
        email,
        password: hashed,
        googleId,
        picture,
        provider: "google",
      });
    }

    const token = generateToken(user._id);

    const redirectTo = `${FRONTEND_URL.replace(
      /\/$/,
      ""
    )}/auth/google/callback?token=${token}`;
    return res.redirect(302, redirectTo);
  } catch (err) {
    console.error("googleCallback error:", err);
    return res.status(500).json({ msg: err.message });
  }
};

export const exchangeCode = async (req, res) => {
  try {
    const { code, redirect_uri, mode } = req.body;
    if (!code)
      return res.status(400).json({ msg: "Authorization code is required" });

    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

    const redirectUri =
      redirect_uri || `${FRONTEND_URL.replace(/\/$/, "")}/auth/google/callback`;

    if (!CLIENT_ID || !CLIENT_SECRET) {
      return res
        .status(500)
        .json({ msg: "Server Google OAuth not configured" });
    }

    const client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      redirectUri
    );

    // Exchange authorization code for tokens
    const { tokens } = await client.getToken({
      code,
      redirect_uri: redirectUri,
    });
    client.setCredentials(tokens);

    // Get user info
    const oauth2 = google.oauth2({ auth: client, version: "v2" });
    const { data } = await oauth2.userinfo.get();
    const { email, name, sub: googleId, picture } = data;
    if (!email)
      return res.status(400).json({ msg: "Email not available from Google" });

    // Find existing user by email
    let user = await User.findOne({ email });

    if (!user && mode === "login") {
      return res
        .status(404)
        .json({ msg: "Account does not exist. Please register first." });
    }

    if (user) {
      let modified = false;
      if (!user.googleId) {
        user.googleId = googleId;
        modified = true;
      }
      if (user.provider !== "google") {
        user.provider = "google";
        modified = true;
      }
      if (!user.picture && picture) {
        user.picture = picture;
        modified = true;
      }
      if (modified) await user.save();

      const token = generateToken(user._id);
      return res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          picture: user.picture || null,
          age: user.age,
          height: user.height,
          weight: user.weight,
          gender: user.gender,
          provider: user.provider,
        },
        token,
      });
    }

    try {
      const rand = Math.random().toString(36).slice(-12);
      const hashed = await bcrypt.hash(rand, 10);
      user = await User.create({
        name: name || "Google User",
        email,
        password: hashed,
        googleId,
        picture,
        provider: "google",
      });
    } catch (createErr) {
      // Handle rare race condition where user was created concurrently
      if (createErr?.code === 11000) {
        user = await User.findOne({ email });
        if (user && (!user.googleId || user.provider !== "google")) {
          user.googleId = user.googleId || googleId;
          user.provider = "google";
          if (!user.picture && picture) user.picture = picture;
          await user.save();
        }
      } else {
        throw createErr;
      }
    }

    const token = generateToken(user._id);
    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture || null,
        age: user.age,
        height: user.height,
        weight: user.weight,
        gender: user.gender,
        provider: user.provider,
      },
      token,
    });
  } catch (err) {
    console.error("exchangeCode error:", err);
    if (err.response?.data?.error === "invalid_grant") {
      return res.status(400).json({ msg: "Invalid grant. Please try again." });
    }
    return res.status(500).json({ msg: err.message });
  }
};
