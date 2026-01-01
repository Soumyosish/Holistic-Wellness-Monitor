import { validationResult } from "express-validator";
import { sendEmail } from "../utils/emailService.js";

export const subscribe = async (req, res) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        msg: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const { email } = req.body;

    // Send confirmation email
    await sendEmail({
      to: email,
      subject: "Newsletter Subscription Confirmed",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #f97316;">Welcome to Holistic Wellness Monitor!</h2>
          <p>Hi there,</p>
          <p>Thank you for subscribing to our newsletter! You make a great choice for your health.</p>
          <p>You have been successfully subscribed to receive the latest health tips, feature updates, and wellness insights directly to your inbox.</p>
          <br/>
          <p>Stay healthy,</p>
          <p><strong>The HWM Team</strong></p>
        </div>
      `,
    });

    res
      .status(200)
      .json({ success: true, message: "You have been subscribed" });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    res.status(500).json({ msg: "Server error during subscription" });
  }
};
