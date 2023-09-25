import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  try {
    // const transporter = nodemailer.createTransport({
    //   host: process.env.HOST,
    //   port: process.env.SMTP_PORT,
    //   secure: true,
    //   auth: {
    //     user: process.env.GMAIL,
    //     pass: process.env.GMAIL_PASS,
    //   },
    //   tls: {
    //     rejectUnauthorized: false,
    //   },
    //   // sendmail: true,
    // });

    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      service: "gmail",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Define the email options
    const mailOptions = {
      from: "anugrah POS",
      to: to?.join(""),
      subject,
      html,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

export default sendEmail;
