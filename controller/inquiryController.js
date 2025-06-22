import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
export const Inquiry = async (req, res) => {
  try {
    const { name, email, phone, vehicle, message, contactMethod } = req.body;

    if (!name || !email || !vehicle) {
      return res
        .status(400)
        .json({ error: "Name, email, and vehicle are required" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `New Inquiry: ${vehicle}`,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Vehicle: ${vehicle}
        Preferred Contact Method: ${contactMethod}
        Message: ${message || "No message provided"}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Inquiry submitted successfully" });
  } catch (error) {
    console.error("Inquiry submission error:", error);
    res.status(500).json({ error: "Failed to submit inquiry" });
  }
};