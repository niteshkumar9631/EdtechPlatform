// // models/Certification.js
// const mongoose = require('mongoose');
// const crypto = require('crypto');

// const CertificationSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
//   issuedAt: { type: Date, default: Date.now },
//   certificateId: { type: String, default: () => (crypto.randomUUID ? crypto.randomUUID() : (Date.now().toString(36) + Math.random().toString(36).slice(2))), unique: true },
//   meta: { type: Object }
// });

// module.exports = mongoose.model('Certification', CertificationSchema);




// models/Certification.js
const mongoose = require('mongoose');
const crypto = require('crypto');

const CertificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  issuedAt: { type: Date, default: Date.now },
  certificateId: {
    type: String,
    default: () =>
      crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now().toString(36) + Math.random().toString(36).slice(2),
    unique: true,
  },
  meta: { type: Object },
  filePath: { type: String }, // added for download link
});

module.exports = mongoose.model('Certification', CertificationSchema);
