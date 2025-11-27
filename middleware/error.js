const multer = require('multer');

const errorHandler = (err, req, res, next) => {
    console.error('Error Stack:', err.stack);
    
    // Default error
    let error = { ...err };
    error.message = err.message;
    
    // Log error for debugging
    console.error('Error:', {
        message: error.message,
        stack: error.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    
    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        req.flash('error', message);
        return res.redirect('back');
    }
    
    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        req.flash('error', message);
        return res.redirect('back');
    }
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        req.flash('error', message);
        return res.redirect('back');
    }
    
    // File upload errors
    if (err instanceof multer.MulterError) {
        let message = 'File upload error';
        
        if (err.code === 'LIMIT_FILE_SIZE') {
            message = 'File too large';
        } else if (err.code === 'LIMIT_FILE_COUNT') {
            message = 'Too many files';
        } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            message = 'Unexpected file field';
        }
        
        req.flash('error', message);
        return res.redirect('back');
    }
    
    // Default error response
    req.flash('error', error.message || 'Server Error');
    res.redirect('back');
};

const notFound = (req, res, next) => {
    const message = `Route ${req.originalUrl} not found`;
    req.flash('error', message);
    res.status(404).redirect('/');
};

module.exports = {
    errorHandler,
    notFound
};