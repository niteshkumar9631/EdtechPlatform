// controllers/assignment.js
const Assignment = require('../models/Assignment');
const Course = require('../models/course');

exports.createAssignment = async (req, res) => {
  try {
    const { title, description, courseId, dueDate, totalMarks, questionIds = [] } = req.body;
    if (!title || !courseId) {
      return res.status(400).json({ success: false, message: 'title and courseId required' });
    }
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const assignment = await Assignment.create({
      title, description, course: courseId, dueDate, totalMarks, questions: questionIds, createdBy: req.user.id
    });

    res.status(201).json({ success: true, data: assignment, message: 'Assignment created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id).populate('questions').populate('createdBy', 'firstName lastName email');
    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });
    res.json({ success: true, data: assignment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.listAssignments = async (req, res) => {
  try {
    const list = await Assignment.find({}).sort({ createdAt: -1 }).populate('course', 'courseName').populate('createdBy', 'firstName lastName');
    res.json({ success: true, data: list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
