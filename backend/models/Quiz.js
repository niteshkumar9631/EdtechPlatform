// models/Quiz.js
const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  durationMinutes: { type: Number, default: 0 },
  questions: [{
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    marks: { type: Number, default: 1 }
  }],
  isAutoGrade: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', QuizSchema);
