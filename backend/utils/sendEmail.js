import { transporter } from "../config/mail.js";

export const sendBookingEmail = async (to, name, time) => {
  await transporter.sendMail({
    from: '"Calendly Clone" <your_email@gmail.com>',
    to: to,
    subject: "Booking Confirmed 🎉",
    html: `
      <h2>Hello ${name},</h2>
      <p>Your booking is confirmed.</p>
      <p><b>Time:</b> ${time}</p>
      <p>Thank you!</p>
    `,
  });
};