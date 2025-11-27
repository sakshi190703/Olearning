const express = require('express');
const studentController = require('../controllers/studentController');
const { isStudent } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const fileUploadConfig = require('../config/multer');

const router = express.Router();

// Configure multer for assignments
const assignmentUpload = fileUploadConfig.createUploader({
    subfolder: 'assignments',
    allowedTypes: ['.pdf', '.doc', '.docx', '.txt'],
    maxSize: 10 * 1024 * 1024 // 10MB
});

// Student Routes
router.get('/dashboard', isStudent, studentController.dashboard);

// Course management
router.get('/listings', isStudent, studentController.getCourseListings);
router.get('/listings/:id', isStudent, studentController.showCourse);
router.post('/courses/:id/enroll', isStudent, studentController.enrollInCourse);
router.post('/courses/:id/unenroll', isStudent, studentController.unenrollFromCourse);

// Assignment routes
router.get('/assignments/:id/submit', isStudent, studentController.showAssignmentSubmission);
router.post('/assignments/:id/submit', isStudent, assignmentUpload.single('submission'), studentController.submitAssignment);
router.get('/assignments/:id/results', isStudent, studentController.showAssignmentResults);

// Test routes
router.get('/tests/:id/take', isStudent, studentController.showTest);
router.post('/tests/:id/submit', isStudent, studentController.submitTest);
router.get('/tests/:id/results', isStudent, studentController.showTestResults);

// Account management
router.delete('/account', isStudent, studentController.deleteAccount);

module.exports = router;