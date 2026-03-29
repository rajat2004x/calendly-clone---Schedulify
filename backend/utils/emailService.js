const nodemailer = require("nodemailer");

// Configure your email service here
// For testing, we'll use a mock transporter
// For production, use Gmail, SendGrid, or other SMTP service


// ✅ REAL EMAIL TRANSPORTER
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rajat2004x@gmail.com",       
    pass: "lxetgclsljkbfeec",          
  },
});

const sendBookingConfirmation = async (booking, eventName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || "noreply@schedulify.com",
    to: booking.email,
    subject: `Booking Confirmed: ${eventName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(to right, #2563eb, #1d4ed8); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .content { background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .detail { margin: 15px 0; }
            .label { font-weight: bold; color: #2563eb; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Booking Confirmed! ✓</h2>
            </div>

            <div class="content">
              <p>Hi ${booking.name},</p>
              <p>Your booking has been confirmed for <strong>${eventName}</strong>.</p>

              <div class="detail">
                <span class="label">📅 Date:</span>
                ${new Date(booking.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              <div class="detail">
                <span class="label">⏰ Time:</span>
                ${booking.start_time} - ${booking.end_time}
              </div>

              <div class="detail">
                <span class="label">📝 Meeting Type:</span>
                ${eventName}
              </div>
            </div>

            <p style="color: #666;">
              You should receive a calendar invite separately. If you have any questions, please reply to this email.
            </p>

            <div class="footer">
              <p>© 2026 Schedulify. All rights reserved.</p>
              <p>This is an automated email, please do not reply directly.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Booking Confirmed!

      Hi ${booking.name},

      Your booking has been confirmed for ${eventName}.

      Date: ${new Date(booking.date).toLocaleDateString()}
      Time: ${booking.start_time} - ${booking.end_time}
      Meeting: ${eventName}

      © 2026 Schedulify
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Confirmation email sent to ${booking.email}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to send confirmation email:", error.message);
    return false;
  }
};

const sendBookingCancellation = async (booking, eventName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || "noreply@schedulify.com",
    to: booking.email,
    subject: `Booking Cancelled: ${eventName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(to right, #ef4444, #dc2626); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .content { background: #fef2f2; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .detail { margin: 15px 0; }
            .label { font-weight: bold; color: #dc2626; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Booking Cancelled</h2>
            </div>

            <div class="content">
              <p>Hi ${booking.name},</p>
              <p>Your booking for <strong>${eventName}</strong> has been cancelled.</p>

              <div class="detail">
                <span class="label">📅 Date:</span>
                ${new Date(booking.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              <div class="detail">
                <span class="label">⏰ Time:</span>
                ${booking.start_time} - ${booking.end_time}
              </div>
            </div>

            <p style="color: #666;">
              If you have any questions, please contact the organizer.
            </p>

            <div class="footer">
              <p>© 2026 Schedulify. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Cancellation email sent to ${booking.email}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to send cancellation email:", error.message);
    return false;
  }
};

module.exports = {
  sendBookingConfirmation,
  sendBookingCancellation,
};
