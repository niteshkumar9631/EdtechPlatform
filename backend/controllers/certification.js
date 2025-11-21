// // controllers/certification.js
// const Certification = require('../models/Certification');
// const User = require('../models/user');
// const Course = require('../models/course');

// exports.issueCertificate = async (req, res) => {
//   try {
//     const { userId, courseId, meta } = req.body;
//     if (!userId || !courseId) return res.status(400).json({ success: false, message: 'userId and courseId required' });

//     const user = await User.findById(userId);
//     const course = await Course.findById(courseId);
//     if (!user || !course) return res.status(404).json({ success: false, message: 'User or Course not found' });

//     const cert = await Certification.create({ user: userId, course: courseId, meta });
//     res.status(201).json({ success: true, data: cert, message: 'Certificate issued' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// exports.verifyCertificate = async (req, res) => {
//   try {
//     const { certificateId } = req.params;
//     const cert = await Certification.findOne({ certificateId }).populate('user', 'firstName lastName email').populate('course', 'courseName');
//     if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' });
//     res.json({ success: true, data: cert });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };




// controllers/certification.js
// const Certification = require('../models/Certification');
// const User = require('../models/user');
// const Course = require('../models/course');
// const PDFDocument = require('pdfkit');
// const fs = require('fs');
// const path = require('path');

// exports.issueCertificate = async (req, res) => {
//   try {
//     const { userId, courseId, meta } = req.body;

//     // Validate required fields
//     if (!userId || !courseId) {
//       return res.status(400).json({
//         success: false,
//         message: 'userId and courseId required',
//       });
//     }

//     // Fetch user and course
//     const user = await User.findById(userId);
//     const course = await Course.findById(courseId);
//     if (!user || !course) {
//       return res.status(404).json({
//         success: false,
//         message: 'User or Course not found',
//       });
//     }

//     // Create new certificate record
//     const cert = await Certification.create({
//       user: userId,
//       course: courseId,
//       meta,
//     });

//     // Ensure certificates folder exists
//     const certDir = path.join(__dirname, '../certificates');
//     if (!fs.existsSync(certDir)) {
//       fs.mkdirSync(certDir);
//     }

//     // Create PDF certificate
//     const fileName = `${cert.certificateId}.pdf`;
//     const filePath = path.join(certDir, fileName);

//     const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });
//     const writeStream = fs.createWriteStream(filePath);
//     doc.pipe(writeStream);

//     // Background color
//     doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f8f8f8');

//     // Title
//     doc
//       .fontSize(40)
//       .fillColor('#333')
//       .text('Certificate of Completion', {
//         align: 'center',
//         underline: true,
//       });

//     doc.moveDown(2);
//     doc.fontSize(22).fillColor('#000').text('This is proudly presented to', {
//       align: 'center',
//     });

//     doc.moveDown(1);
//     doc
//       .fontSize(30)
//       .fillColor('#007bff')
//       .text(`${user.firstName} ${user.lastName}`, {
//         align: 'center',
//       });

//     doc.moveDown(1);
//     doc.fontSize(18).fillColor('#000').text('for successfully completing the course', {
//       align: 'center',
//     });

//     doc.moveDown(0.5);
//     doc.fontSize(26).fillColor('#444').text(course.courseName, {
//       align: 'center',
//       underline: true,
//     });

//     doc.moveDown(1.5);
//     doc.fontSize(14).fillColor('#666').text(
//       `Issued on ${new Date(cert.issuedAt).toDateString()}`,
//       {
//         align: 'center',
//       }
//     );

//     doc.moveDown(2);
//     doc.fontSize(12).fillColor('#999').text(`Certificate ID: ${cert.certificateId}`, {
//       align: 'center',
//     });

//     doc.end();

//     // Wait until file is written
//     await new Promise((resolve) => writeStream.on('finish', resolve));

//     // Save PDF path in DB
//     cert.filePath = `/certificates/${fileName}`;
//     await cert.save();

//     // Respond with certificate + download link
//     res.status(201).json({
//       success: true,
//       message: 'Certificate issued successfully',
//       data: cert,
//       downloadLink: `${req.protocol}://${req.get('host')}${cert.filePath}`,
//       pdfURL: `${req.protocol}://${req.get('host')}${cert.filePath}`,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// exports.verifyCertificate = async (req, res) => {
//   try {
//     const { certificateId } = req.params;
//     const cert = await Certification.findOne({ certificateId })
//       .populate('user', 'firstName lastName email')
//       .populate('course', 'courseName');

//     if (!cert) {
//       return res.status(404).json({
//         success: false,
//         message: 'Certificate not found',
//       });
//     }

//     res.json({
//       success: true,
//       data: cert,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };




const Certification = require('../models/Certification');
const User = require('../models/user');
const Course = require('../models/course');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.issueCertificate = async (req, res) => {
  try {
    const { courseId, meta } = req.body;
    const userId = req.user.id; // from auth middleware

    if (!userId || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'userId and courseId required',
      });
    }

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(404).json({
        success: false,
        message: 'User or Course not found',
      });
    }

    const cert = await Certification.create({
      user: userId,
      course: courseId,
      meta,
    });

    const certDir = path.join(__dirname, '../certificates');
    if (!fs.existsSync(certDir)) {
      fs.mkdirSync(certDir);
    }

    const fileName = `${cert.certificateId}.pdf`;
    const filePath = path.join(certDir, fileName);

    const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f8f8f8');

    doc
      .fontSize(40)
      .fillColor('#333')
      .text('Certificate of Completion', { align: 'center', underline: true });

    doc.moveDown(2);
    doc.fontSize(22).fillColor('#000').text('This is proudly presented to', {
      align: 'center',
    });

    doc.moveDown(1);
    doc.fontSize(30).fillColor('#007bff').text(
      `${user.firstName} ${user.lastName}`,
      { align: 'center' }
    );

    doc.moveDown(1);
    doc.fontSize(18).fillColor('#000').text('for successfully completing the course', {
      align: 'center',
    });

    doc.moveDown(0.5);
    doc
      .fontSize(26)
      .fillColor('#444')
      .text(course.courseName, { align: 'center', underline: true });

    doc.moveDown(1.5);
    doc.fontSize(14).fillColor('#666').text(
      `Issued on ${new Date(cert.issuedAt).toDateString()}`,
      { align: 'center' }
    );

    doc.moveDown(2);
    doc.fontSize(12).fillColor('#999').text(
      `Certificate ID: ${cert.certificateId}`,
      { align: 'center' }
    );

    doc.end();
    await new Promise((resolve) => writeStream.on('finish', resolve));

    // Save path in DB
    cert.filePath = `/certificates/${fileName}`;
    await cert.save();

    res.status(201).json({
      success: true,
      message: 'Certificate issued successfully',
      data: cert,
      downloadLink: `${req.protocol}://${req.get('host')}${cert.filePath}`,
      pdfURL: `${req.protocol}://${req.get('host')}${cert.filePath}`,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};



exports.verifyCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const cert = await Certification.findOne({ certificateId })
      .populate('user', 'firstName lastName email')
      .populate('course', 'courseName');

    if (!cert) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
      });
    }

    res.json({
      success: true,
      data: cert,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
