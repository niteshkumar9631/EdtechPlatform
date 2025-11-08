// controllers/quiz.js
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

exports.createQuiz = async (req, res) => {
  try {
    const { title, description, durationMinutes, questions = [], isAutoGrade = true } = req.body;
    if (!title || !questions.length) return res.status(400).json({ success: false, message: 'title and questions required' });

    const quiz = await Quiz.create({
      title, description, durationMinutes, questions, isAutoGrade, createdBy: req.user.id
    });

    res.status(201).json({ success: true, data: quiz, message: 'Quiz created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Auto-grading endpoint for MCQ attempts
exports.attemptQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    // answers: [{ questionId, selectedOptionIndex }]
    if (!quizId || !Array.isArray(answers)) return res.status(400).json({ success: false, message: 'quizId and answers required' });

    const quiz = await Quiz.findById(quizId).populate({ path: 'questions.question' });
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    let totalMarks = 0;
    let obtained = 0;
    const details = [];

    for (const qEntry of quiz.questions) {
      totalMarks += qEntry.marks || 1;
      const userAnswer = answers.find(a => String(a.questionId) === String(qEntry.question._id));
      const correctOption = qEntry.question.options?.findIndex(opt => opt.isCorrect === true);
      const selectedIndex = userAnswer?.selectedOptionIndex;
      const marksForQ = qEntry.marks || 1;
      let scored = 0;
      if (typeof selectedIndex !== 'undefined' && correctOption === selectedIndex) {
        obtained += marksForQ;
        scored = marksForQ;
      }
      details.push({
        questionId: qEntry.question._id,
        scored,
        correctOption,
        selectedIndex
      });
    }

    res.json({ success: true, totalMarks, obtained, details });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
