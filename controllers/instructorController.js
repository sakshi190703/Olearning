const userService = require('../services/userService');
const courseService = require('../services/courseService');
const assignmentService = require('../services/assignmentService');
const testService = require('../services/testService');
const { asyncHandler } = require('../middleware/validation');

class InstructorController {
    // Render instructor dashboard
    dashboard = asyncHandler(async (req, res) => {
        const user = await userService.findUserById(req.user._id);
        const courses = await courseService.getCoursesByInstructor(req.user._id);
        
        res.render('profile/instructor', { user, courses });
    });

    // Show create course form
    showCreateCourse = (req, res) => {
        res.render('listings/new');
    };

    // Create new course
    createCourse = asyncHandler(async (req, res) => {
        const { title, instructor, description, price } = req.body.listing;
        
        const courseData = {
            title,
            instructor,
            description,
            price: Number(price),
            image: req.file ? req.file.path : null,
            createdBy: req.user._id
        };

        const newCourse = await courseService.createCourse(courseData);
        
        req.flash('success', 'Course created successfully!');
        res.render('listings/success', { course: newCourse });
    });

    // Show edit course form
    showEditCourse = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const listing = await courseService.getCourseById(id);
        
        if (!listing || !listing.createdBy.equals(req.user._id)) {
            req.flash('error', 'Unauthorized or course not found.');
            return res.redirect('/instructor/dashboard');
        }

        res.render('listings/edit', { listing });
    });

    // Update course
    updateCourse = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { title, instructor, description, price } = req.body.listing;
        
        const updateData = {
            title,
            instructor,
            description,
            price: Number(price)
        };

        if (req.file) {
            updateData.image = req.file.path;
        }

        await courseService.updateCourse(id, updateData);
        
        req.flash('success', 'Course updated successfully!');
        res.redirect('/instructor/dashboard');
    });

    // Delete course
    deleteCourse = asyncHandler(async (req, res) => {
        const { id } = req.params;
        
        await courseService.deleteCourse(id);
        
        req.flash('success', 'Course deleted successfully!');
        res.redirect('/instructor/dashboard');
    });

    // Show assignments for a course
    showCourseAssignments = asyncHandler(async (req, res) => {
        const { courseId } = req.params;
        const course = await courseService.getCourseById(courseId);
        
        if (!course || !course.createdBy.equals(req.user._id)) {
            req.flash('error', 'Unauthorized or course not found.');
            return res.redirect('/instructor/dashboard');
        }

        const assignments = await assignmentService.getAssignmentsByCourse(courseId);
        res.render('assignments/list', { course, assignments });
    });

    // Show tests for a course
    showCourseTests = asyncHandler(async (req, res) => {
        const { courseId } = req.params;
        const course = await courseService.getCourseById(courseId);
        
        if (!course || !course.createdBy.equals(req.user._id)) {
            req.flash('error', 'Unauthorized or course not found.');
            return res.redirect('/instructor/dashboard');
        }

        const tests = await testService.getTestsByCourse(courseId);
        res.render('tests/list', { course, tests });
    });

    // Show create assignment form
    showCreateAssignment = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const course = await courseService.getCourseById(id);
        
        if (!course || !course.createdBy.equals(req.user._id)) {
            req.flash('error', 'Unauthorized or course not found.');
            return res.redirect('/instructor/dashboard');
        }

        res.render('assignments/new', { course });
    });

    // Create assignment
    createAssignment = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { title, description } = req.body.assignment;
        
        const assignmentData = {
            title,
            description,
            course: id,
            createdBy: req.user._id
        };

        await assignmentService.createAssignment(assignmentData);
        
        req.flash('success', 'Assignment created successfully!');
        res.redirect('/instructor/dashboard');
    });

    // Show create test form
    showCreateTest = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const course = await courseService.getCourseById(id);
        
        if (!course || !course.createdBy.equals(req.user._id)) {
            req.flash('error', 'Unauthorized or course not found.');
            return res.redirect('/instructor/dashboard');
        }

        res.render('tests/new', { course });
    });

    // Create test
    createTest = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { title, questions } = req.body.test;
        
        const testData = {
            title,
            questions: questions.map(q => ({
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer
            })),
            course: id,
            createdBy: req.user._id
        };

        await testService.createTest(testData);
        
        req.flash('success', 'Test created successfully!');
        res.redirect('/instructor/dashboard');
    });

    // Show assignment grading page
    showAssignmentGrading = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const assignment = await assignmentService.getAssignmentById(id);
        
        if (!assignment || !assignment.createdBy.equals(req.user._id)) {
            req.flash('error', 'Unauthorized or assignment not found.');
            return res.redirect('/instructor/dashboard');
        }

        const students = await assignmentService.getStudentSubmissions(id);
        res.render('assignments/grade', { assignment, students });
    });

    // Grade assignment
    gradeAssignment = asyncHandler(async (req, res) => {
        const { id, studentId } = req.params;
        const { score } = req.body;
        
        await userService.gradeAssignment(studentId, id, Number(score));
        
        req.flash('success', 'Assignment graded successfully!');
        res.redirect(`/instructor/assignments/${id}/grade`);
    });

    // Show test grading page
    showTestGrading = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const test = await testService.getTestById(id);
        
        if (!test || !test.createdBy.equals(req.user._id)) {
            req.flash('error', 'Unauthorized or test not found.');
            return res.redirect('/instructor/dashboard');
        }

        const students = await testService.getStudentAttempts(id);
        res.render('tests/grade', { test, students });
    });

    // Grade test (override automatic scoring)
    gradeTest = asyncHandler(async (req, res) => {
        const { id, studentId } = req.params;
        const { score } = req.body;
        
        await userService.gradeTest(studentId, id, Number(score));
        
        req.flash('success', 'Test graded successfully!');
        res.redirect(`/instructor/tests/${id}/grade`);
    });
}

module.exports = new InstructorController();