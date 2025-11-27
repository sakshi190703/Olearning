const passport = require('passport');
const userService = require('../services/userService');
const { asyncHandler } = require('../middleware/validation');

class AuthController {
    // Render login page
    renderLogin = (req, res) => {
        res.render('auth/login');
    };

    // Handle login
    login = [
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: true
        }),
        (req, res) => {
            if (!req.user) {
                req.flash('error', 'Authentication failed. Please try again.');
                return res.redirect('/login');
            }

            const redirectUrl = req.user.role === 'instructor' 
                ? '/instructor/dashboard' 
                : '/student/dashboard';
            
            req.flash('success', 'Successfully logged in!');
            res.redirect(redirectUrl);
        }
    ];

    // Render signup page
    renderSignup = (req, res) => {
        res.render('auth/signup');
    };

    // Handle signup
    signup = asyncHandler(async (req, res) => {
        const { email, username, password, role } = req.body;

        // Check if user already exists
        const existingUser = await userService.findUserByEmail(email);
        if (existingUser) {
            req.flash('error', 'Email already in use.');
            return res.redirect('/signup');
        }

        // Create new user
        const user = await userService.createUser({ 
            email, 
            username, 
            password, 
            role 
        });

        // Log the user in
        req.login(user, (err) => {
            if (err) {
                req.flash('error', 'Error during login after signup.');
                return res.redirect('/login');
            }

            req.flash('success', 'Successfully signed up and logged in!');
            const redirectUrl = role === 'instructor' 
                ? '/instructor/dashboard' 
                : '/student/dashboard';
            res.redirect(redirectUrl);
        });
    });

    // Handle logout
    logout = (req, res, next) => {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Successfully logged out!');
            res.redirect('/login');
        });
    };
}

module.exports = new AuthController();