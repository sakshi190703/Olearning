const userService = require('../services/userService');
const courseService = require('../services/courseService');
const assignmentService = require('../services/assignmentService');
const testService = require('../services/testService');
const { asyncHandler } = require('../middleware/validation');

class StudentController {
    // Render student dashboard
    dashboard = asyncHandler(async (req, res) => {
        const user = await userService.findUserById(req.user._id);
        const populatedUser = await user.populate([
            { path: 'enrolledCourses.course' },
            { 
                path: 'submittedAssignments.assignment',
                populate: { path: 'course' }
            },
            {
                path: 'testScores.test',
                populate: { path: 'course' }
            }
        ]);

        res.render('profile/student', { user: populatedUser });
    });

    // Get all course listings
    getCourseListings = asyncHandler(async (req, res) => {
        const allListings = await courseService.getAllCourses();
        res.render('listings/index', { allListings });
    });

    // Show specific course
    showCourse = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const courseData = await courseService.getCourseWithContent(id);
        
        res.render('listings/show', {
            listing: courseData.course,
            assignments: courseData.assignments,
            tests: courseData.tests
        });
    });

    // Enroll in course
    enrollInCourse = asyncHandler(async (req, res) => {
        const { id } = req.params;
        
        try {
            await userService.enrollUserInCourse(req.user._id, id);
            req.flash('success', 'Successfully enrolled in course!');
        } catch (error) {
            req.flash('error', error.message);
        }
        
        res.redirect('/student/dashboard');
    });

    // Unenroll from course
    unenrollFromCourse = asyncHandler(async (req, res) => {
        const { id } = req.params;
        
        await userService.unenrollUserFromCourse(req.user._id, id);
        req.flash('success', 'Successfully unenrolled from course.');
        res.redirect('/student/dashboard');
    });

    // Show assignment submission page
    showAssignmentSubmission = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const assignment = await assignmentService.getAssignmentById(id);
        
        if (!assignment) {
            req.flash('error', 'Assignment not found.');
            return res.redirect('/student/dashboard');
        }

        // Check if already submitted
        const existingSubmission = await assignmentService.getStudentSubmission(req.user._id, id);
        
        if (existingSubmission) {
            return res.render('assignments/results', { 
                assignment, 
                assignmentSubmission: existingSubmission 
            });
        }

        res.render('assignments/submit', { assignment });
    });

    // Submit assignment
    submitAssignment = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const assignment = await assignmentService.getAssignmentById(id);
        
        if (!assignment) {
            req.flash('error', 'Assignment not found.');
            return res.redirect('/student/dashboard');
        }

        // Get submission (text or file)
        const submission = req.file ? req.file.path : req.body.submission;
        
        if (!submission) {
            req.flash('error', 'Please provide a submission (text or file).');
            return res.redirect(`/student/assignments/${id}/submit`);
        }

        try {
            await userService.submitAssignment(req.user._id, id, submission);
            req.flash('success', 'Assignment submitted successfully!');
            res.redirect(`/student/assignments/${id}/results`);
        } catch (error) {
            req.flash('error', error.message);
            res.redirect(`/student/assignments/${id}/submit`);
        }
    });

    // Show assignment results
    showAssignmentResults = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const assignment = await assignmentService.getAssignmentById(id);
        
        if (!assignment) {
            req.flash('error', 'Assignment not found.');
            return res.redirect('/student/dashboard');
        }

        const assignmentSubmission = await assignmentService.getStudentSubmission(req.user._id, id);
        
        if (!assignmentSubmission) {
            req.flash('error', 'No submission found for this assignment.');
            return res.redirect(`/student/assignments/${id}/submit`);
        }

        res.render('assignments/results', { assignment, assignmentSubmission });
    });

    // Show test taking page
    showTest = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const test = await testService.getTestById(id);
        
        if (!test) {
            req.flash('error', 'Test not found.');
            return res.redirect('/student/dashboard');
        }

        // Check if already submitted
        const existingAttempt = await testService.getStudentAttempt(req.user._id, id);
        
        if (existingAttempt) {
            return res.render('tests/results', { 
                test, 
                testAttempt: existingAttempt 
            });
        }

        res.render('tests/take', { test });
    });

    // Submit test
    submitTest = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const answers = req.body.answers || {};
        
        // Calculate score
        const scoreData = await testService.calculateScore(id, answers);
        
        // Save test attempt
        await userService.submitTest(req.user._id, id, scoreData.answers, scoreData.score);
        
        req.flash('success', 'Test submitted successfully!');
        res.redirect('/student/dashboard');
    });

    // Show test results
    showTestResults = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const test = await testService.getTestById(id);
        
        if (!test) {
            req.flash('error', 'Test not found.');
            return res.redirect('/student/dashboard');
        }

        const testAttempt = await testService.getStudentAttempt(req.user._id, id);
        
        if (!testAttempt) {
            req.flash('error', 'No submission found for this test.');
            return res.redirect(`/student/tests/${id}/take`);
        }

        res.render('tests/results', { test, testAttempt });
    });

    // Delete account
    deleteAccount = asyncHandler(async (req, res) => {
        await userService.deleteUser(req.user._id);
        
        req.logout((err) => {
            if (err) {
                req.flash('error', 'Error deleting account.');
                return res.redirect('/student/dashboard');
            }
            req.flash('success', 'Account deleted successfully.');
            res.redirect('/login');
        });
    });
}

module.exports = new StudentController();