// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// exports.sendEmailWithAttachment = async (to, subject, text, attachmentPath) => {
//   try {
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to,
//       subject,
//       text,
//       attachments: [{ filename: attachmentPath.split("/").pop(), path: attachmentPath }],
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`✅ Email sent successfully to ${to}`);
//   } catch (err) {
//     console.error("❌ Email sending failed:", err.message);
//     throw new Error("Email sending failed");
//   }
// };
 



const nodemailer = require('nodemailer');

const mailSender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    const info = await transporter.sendMail({
      from: 'EdTech Platform <no-reply@edtech.com>',
      to: email,
      subject: title,
      html: body
    });

    return info;
  } catch (error) {
    console.log('❌ Error while sending mail (mailSender):', error.message);
    return false;
  }
};

module.exports = mailSender;
