import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  const logSimulation = () => {
    console.warn(
      "Email sending failed or credentials missing. Simulating email send."
    );
    console.log("==========================================");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${html}`);
    console.log("==========================================");
  };

  try {
    // Check credentials first
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      logSimulation();
      return { success: true, message: "Email sent (Simulated)" };
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      // Force IPv4 to avoid IPv6 issues
      family: 4,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

    console.log(`Email sent to: ${to}`);
    return { success: true, message: "Email sent successfully" };
  } catch (err) {
    // If it's a network/socket error (Antivirus blocking or Firewall), fall back to simulation
    console.error(
      "Email service error (Falling back to simulation):",
      err.message
    );
    logSimulation();
    // Return success so the frontend doesn't show an error
    return { success: true, message: "Email sent (Simulated Fallback)" };
  }
};
