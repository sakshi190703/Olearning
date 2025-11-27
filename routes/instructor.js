const express = require('express');
const instructorController = require('../controllers/instructorController');
const { isInstructor, checkOwnership } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const { courseValidation, assignmentValidation, testValidation, gradeValidation } = require('../validators/courseValidators');
const fileUploadConfig = require('../config/multer');
const Listing = require('../models/listing');
const Assignment = require('../models/assignment');
const Test = require('../models/test');

const router = express.Router();

// Configure multer for course images
const courseImageUpload = fileUploadConfig.createUploader({
    subfolder: 'courses',
    allowedTypes: ['.jpg', '.jpeg', '.png', '.gif'],
    maxSize: 5 * 1024 * 1024 // 5MB
});

// Dashboard
router.get('/dashboard', isInstructor, instructorController.dashboard);

// Course routes
router.get('/courses/new', isInstructor, instructorController.showCreateCourse);
router.post('/courses/new', isInstructor, courseImageUpload.single('listing[image]'), instructorController.createCourse);

router.get('/courses/:id/edit', isInstructor, checkOwnership(Listing), instructorController.showEditCourse);
router.put('/courses/:id', isInstructor, checkOwnership(Listing), courseImageUpload.single('listing[image]'), instructorController.updateCourse);
router.delete('/courses/:id', isInstructor, checkOwnership(Listing), instructorController.deleteCourse);

// Course content management
router.get('/courses/:courseId/assignments', isInstructor, instructorController.showCourseAssignments);
router.get('/courses/:courseId/tests', isInstructor, instructorController.showCourseTests);

// Assignment routes
router.get('/courses/:id/assignments/new', isInstructor, instructorController.showCreateAssignment);
router.post('/courses/:id/assignments', isInstructor, instructorController.createAssignment);

// Test routes
router.get('/courses/:id/tests/new', isInstructor, instructorController.showCreateTest);
router.post('/courses/:id/tests', isInstructor, instructorController.createTest);

// Grading routes
router.get('/assignments/:id/grade', isInstructor, checkOwnership(Assignment), instructorController.showAssignmentGrading);
router.post('/assignments/:id/grade/:studentId', isInstructor, checkOwnership(Assignment), instructorController.gradeAssignment);

router.get('/tests/:id/grade', isInstructor, checkOwnership(Test), instructorController.showTestGrading);
router.post('/tests/:id/grade/:studentId', isInstructor, checkOwnership(Test), instructorController.gradeTest);

module.exports = router;