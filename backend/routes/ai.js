const express = require("express");
const router = express.Router();
const { auth, isInstructor } = require("../middleware/auth");
const { generateQuestions } = require("../controllers/ai");
const { exportAndEmailPDF } = require("../controllers/aiExport");

// =============================
// 🔹 AI Question Generation
// =============================
// Only Instructors can generate AI questions
router.post("/generate", auth, isInstructor, generateQuestions);

// =============================
// 🔹 Export + Email AI Questions as PDF
// =============================
// Also restricted to Instructors for safety
router.post("/export", auth, isInstructor, exportAndEmailPDF);

module.exports = router;
