import nodemailer from "nodemailer";
import dotenv from "dotenv";

// 1. Load env vars specifically for this file to be safe
dotenv.config(); 

const sendContactEmail = async ({ name, email, phone, subject, message }) => {
  try {
    // 2. Create the Transporter INSIDE the function
    // This ensures process.env is fully loaded when the email is actually sent.
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use 'gmail' or your SMTP host
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3. Configure Email Options
    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`, // Sender address
      to: process.env.EMAIL_USER, // Receiver (usually your own email to get the notification)
      replyTo: email, // Valid reply-to address
      subject: subject || `New Contact Form Submission from ${name}`,
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Subject:</strong> ${subject || "N/A"}</p>
        <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px;">
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      `,
    };

    // 4. Send Email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending contact email:", error);
    // We throw the error so the calling function knows it failed (optional)
    throw error;
  }
};

export default sendContactEmail;