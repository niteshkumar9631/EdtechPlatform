// routes/assignment.js
const express = require('express');
const router = express.Router();
const { auth, isInstructor } = require('../middleware/auth');
const { createAssignment, getAssignment, listAssignments } = require('../controllers/assignment');

router.post('/create', auth, isInstructor, createAssignment);
router.get('/:id', auth, getAssignment);
router.get('/', auth, listAssignments);

module.exports = router;
