import nodemailer from "nodemailer";

export const sendContactMessage = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const user = req.user; // From protect middleware

    if (!subject || !message) {
      return res
        .status(400)
        .json({ msg: "Please provide both subject and message" });
    }

    const adminEmail = "soumyosishpal.108@gmail.com"; // Hardcoded admin email as requested

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailContentAdmin = `
      <h3>New Contact Message</h3>
      <p><strong>From:</strong> ${user.name} (${user.email})</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <div style="border: 1px solid #ccc; padding: 10px; margin-top: 10px;">
        ${message.replace(/\n/g, "<br>")}
      </div>
    `;

    const emailContentUser = `
      <h3>Message Received</h3>
      <p>Hi ${user.name},</p>
      <p>We have received your message and will get back to you shortly.</p>
      <hr>
      <p><strong>Your Message:</strong></p>
      <p><strong>Subject:</strong> ${subject}</p>
      <div style="border: 1px solid #e0e0e0; padding: 10px; color: #555;">
        ${message.replace(/\n/g, "<br>")}
      </div>
    `;

    // Check credentials and send
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      // 1. Send to Admin
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: `Contact Us: ${subject}`,
        html: emailContentAdmin,
        replyTo: user.email,
      });

      // 2. Send copy to User
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Copy: ${subject}`,
        html: emailContentUser,
      });

      res.status(200).json({ success: true, msg: "Message sent successfully" });
    } else {
      console.warn(
        "EMAIL_USER/PASS not set. Logging contact message manually."
      );
      console.log("=== CONTACT MESSAGE (ADMIN COPY) ===");
      console.log(`To: ${adminEmail}`);
      console.log(`From: ${user.email}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message}`);
      console.log("====================================");

      res.status(200).json({
        success: true,
        msg: "Message sent successfully (Dev Mode: Emails logged to console)",
      });
    }
  } catch (error) {
    console.error("Contact email error:", error);
    res.status(500).json({ msg: "Failed to send message" });
  }
};
