// const fs = require("fs");
// const path = require("path");
// const PDFDocument = require("pdfkit");
// const { sendEmailWithAttachment } = require("../services/emailService");

// // Generate PDF from question data
// function generateQuestionPDF(questions = [], outputPath) {
//   return new Promise((resolve, reject) => {
//     try {
//       const doc = new PDFDocument({ margin: 50 });
//       const stream = fs.createWriteStream(outputPath);
//       doc.pipe(stream);

//       doc.fontSize(20).text("AI-Generated Question Paper", { align: "center" });
//       doc.moveDown(1);

//       questions.forEach((q, index) => {
//         doc.fontSize(14).text(`${index + 1}. ${q.question}`);
//         if (q.type === "MCQ" && q.options?.length) {
//           doc.moveDown(0.3);
//           q.options.forEach((opt, i) => {
//             doc.fontSize(12).text(`   ${String.fromCharCode(97 + i)}) ${opt}`);
//           });
//         }
//         if (q.answer) {
//           doc.moveDown(0.3);
//           doc.fontSize(12).text(`Answer: ${q.answer}`, { italic: true });
//         }
//         if (q.explanation) {
//           doc.fontSize(12).text(`Explanation: ${q.explanation}`, { italic: true });
//         }
//         doc.moveDown(1);
//       });

//       doc.end();

//       stream.on("finish", () => resolve(outputPath));
//       stream.on("error", reject);
//     } catch (err) {
//       reject(err);
//     }
//   });
// }

// // Controller to handle export and email
// exports.exportAndEmailPDF = async (req, res) => {
//   try {
//     const { questions, email } = req.body;
//     if (!questions || !Array.isArray(questions) || questions.length === 0)
//       return res.status(400).json({ success: false, message: "questions array is required" });
//     if (!email)
//       return res.status(400).json({ success: false, message: "email is required" });

//     // Generate PDF
//     const filename = `AI_Questions_${Date.now()}.pdf`;
//     const outputPath = path.join(__dirname, "../temp", filename);
//     fs.mkdirSync(path.join(__dirname, "../temp"), { recursive: true });

//     await generateQuestionPDF(questions, outputPath);

//     // Send email
//     await sendEmailWithAttachment(email, "Your AI-Generated Question Paper", "Please find the attached question paper.", outputPath);

//     return res.download(outputPath, filename, (err) => {
//       if (err) console.error("Download error:", err);
//       setTimeout(() => fs.unlinkSync(outputPath), 5000); // delete after sending
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };




// const PDFDocument = require("pdfkit");
// const fs = require("fs");
// const path = require("path");
// const mailSender = require("../utils/mailSender");

// // =============================
// // 📄 Export + Email AI Questions
// // =============================
// exports.exportAndEmailPDF = async (req, res) => {
//   try {
//     const { questions = [], email } = req.body;

//     if (!questions.length)
//       return res.status(400).json({ success: false, message: "No questions provided" });

//     // 1️⃣ Generate a temporary PDF
//     const doc = new PDFDocument();
//     const filePath = path.join(__dirname, "../temp", `QuestionPaper_${Date.now()}.pdf`);
//     const stream = fs.createWriteStream(filePath);
//     doc.pipe(stream);

//     doc.fontSize(18).text("📘 AI-Generated Question Paper", { align: "center" });
//     doc.moveDown(2);

//     questions.forEach((q, i) => {
//       doc.fontSize(14).text(`${i + 1}. ${q.question}`);
//       if (q.type === "MCQ" && q.options?.length) {
//         q.options.forEach((opt, j) => doc.text(`   ${String.fromCharCode(97 + j)}) ${opt}`));
//       }
//       if (q.answer) doc.text(`Answer: ${q.answer}`);
//       if (q.explanation) doc.text(`Explanation: ${q.explanation}`);
//       doc.moveDown(1.5);
//     });

//     doc.end();
//     await new Promise(resolve => stream.on("finish", resolve));

//     // 2️⃣ Email (if provided)
//     if (email) {
//       try {
//         await mailSender(
//           email,
//           "Your AI-Generated Question Paper",
//           `<p>Attached is your AI-generated question paper PDF.</p>`
//         );

//         console.log(`✅ Email sent to ${email}`);
//       } catch (mailErr) {
//         console.error("❌ Email send failed:", mailErr.message);
//         return res.status(500).json({ success: false, message: "Email sending failed" });
//       }
//     }

//     // 3️⃣ Allow PDF download
//     res.download(filePath, "QuestionPaper.pdf", err => {
//       fs.unlink(filePath, () => {}); // auto delete temp file
//       if (err) console.error("❌ Download failed:", err.message);
//     });

//   } catch (err) {
//     console.error("❌ Export PDF failed:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };



// controllers/ aiExport.js
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

// =============================
// 📄 Export + Email AI Questions with Attachment
// =============================
exports.exportAndEmailPDF = async (req, res) => {
  try {
    const { questions = [], email } = req.body;

    if (!questions.length)
      return res
        .status(400)
        .json({ success: false, message: "No questions provided" });

    // 1️⃣ Ensure tmp folder exists
    const tmpDir = path.join(__dirname, "../tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    // 2️⃣ Generate a temporary PDF
    const filePath = path.join(tmpDir, `QuestionPaper_${Date.now()}.pdf`);
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(18).text("📘 AI-Generated Question Paper", { align: "center" });
    doc.moveDown(2);

    questions.forEach((q, i) => {
      doc.fontSize(14).text(`${i + 1}. ${q.question}`);
      if (q.type === "MCQ" && q.options?.length) {
        q.options.forEach((opt, j) =>
          doc.text(`   ${String.fromCharCode(97 + j)}) ${opt}`)
        );
      }
      if (q.answer) doc.text(`Answer: ${q.answer}`);
      if (q.explanation) doc.text(`Explanation: ${q.explanation}`);
      doc.moveDown(1.5);
    });

    doc.end();
    await new Promise((resolve) => stream.on("finish", resolve));

    // 3️⃣ Email with attachment (if email is provided)
    if (email) {
      try {
        // Create transporter
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.MAIL_USER, // your email
            pass: process.env.MAIL_PASS, // app password
          },
        });

        // Email options
        const mailOptions = {
          from: `"EdTech Platform" <${process.env.MAIL_USER}>`,
          to: email,
          subject: "Your AI-Generated Question Paper 📘",
          html: `<p>Dear User,</p>
                 <p>Please find attached your AI-generated question paper.</p>
                 <p>Best regards,<br/>Team EdTech</p>`,
          attachments: [
            {
              filename: "QuestionPaper.pdf",
              path: filePath,
            },
          ],
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${email}`);
      } catch (mailErr) {
        console.error("❌ Email send failed:", mailErr);
        return res.status(500).json({
          success: false,
          message: "Email sending failed. Check credentials or allow less secure app access.",
        });
      }
    }

    // 4️⃣ Send response + delete temp file
    res.status(200).json({
      success: true,
      message: email
        ? "PDF generated and emailed successfully"
        : "PDF generated successfully",
    });

    // Cleanup temp file
    fs.unlink(filePath, () => {});
  } catch (err) {
    console.error("❌ Export PDF failed:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
