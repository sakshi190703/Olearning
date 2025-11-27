const { body } = require('express-validator');

const courseValidation = [
    body('listing.title')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Course title must be between 3 and 100 characters'),
    
    body('listing.instructor')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Instructor name must be between 2 and 50 characters'),
    
    body('listing.description')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Course description must be between 10 and 1000 characters'),
    
    body('listing.price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number')
];

const assignmentValidation = [
    body('assignment.title')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Assignment title must be between 3 and 100 characters'),
    
    body('assignment.description')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Assignment description must be between 10 and 2000 characters')
];

const testValidation = [
    body('test.title')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Test title must be between 3 and 100 characters'),
    
    body('test.questions')
        .isArray({ min: 1 })
        .withMessage('Test must have at least one question'),
    
    body('test.questions.*.question')
        .trim()
        .isLength({ min: 5, max: 500 })
        .withMessage('Each question must be between 5 and 500 characters'),
    
    body('test.questions.*.options')
        .isArray({ min: 2, max: 6 })
        .withMessage('Each question must have between 2 and 6 options'),
    
    body('test.questions.*.correctAnswer')
        .notEmpty()
        .withMessage('Each question must have a correct answer')
];

const gradeValidation = [
    body('score')
        .isFloat({ min: 0, max: 100 })
        .withMessage('Score must be between 0 and 100')
];

module.exports = {
    courseValidation,
    assignmentValidation,
    testValidation,
    gradeValidation
};