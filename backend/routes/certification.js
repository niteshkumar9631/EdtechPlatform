// routes/certification.js
const express = require('express');
const router = express.Router();
const { auth, isInstructor } = require('../middleware/auth');
const { issueCertificate, verifyCertificate } = require('../controllers/certification');

router.post('/issue', auth, isInstructor, issueCertificate);
router.get('/verify/:certificateId', verifyCertificate);

module.exports = router;
