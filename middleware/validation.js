const { validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        req.flash('error', errorMessages.join(', '));
        
        // Redirect back to the previous page or a default page
        const redirectUrl = req.get('Referer') || '/';
        return res.redirect(redirectUrl);
    }
    
    next();
};

const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = {
    handleValidationErrors,
    asyncHandler
};