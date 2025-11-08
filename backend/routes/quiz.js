// routes/quiz.js
const express = require('express');
const router = express.Router();
const { auth, isInstructor, isStudent } = require('../middleware/auth');
const { createQuiz, attemptQuiz } = require('../controllers/quiz');

router.post('/create', auth, isInstructor, createQuiz);
router.post('/attempt', auth, isStudent, attemptQuiz);

module.exports = router;
