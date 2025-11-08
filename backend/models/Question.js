// models/Question.js
const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
  text: { type: String },
  isCorrect: { type: Boolean, default: false }
});

const QuestionSchema = new mongoose.Schema({
  type: { type: String, enum: ['MCQ', 'Subjective'], default: 'MCQ' },
  question: { type: String, required: true },
  options: [OptionSchema],
  answer: { type: String },
  explanation: { type: String },
  topics: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', QuestionSchema);
