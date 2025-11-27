const express = require('express');
const authController = require('../controllers/authController');
const { isGuest } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const { signupValidation, loginValidation } = require('../validators/authValidators');

const router = express.Router();

// Auth Routes
router.get('/login', isGuest, authController.renderLogin);
router.post('/login', authController.login);

router.get('/signup', isGuest, authController.renderSignup);
router.post('/signup', authController.signup);

router.get('/logout', authController.logout);

module.exports = router;