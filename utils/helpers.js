const AppError = require('./AppError');

// Success response handler
const sendSuccessResponse = (res, statusCode, data = null, message = 'Success') => {
    const response = {
        success: true,
        message,
        data
    };

    res.status(statusCode).json(response);
};

// Error response handler
const sendErrorResponse = (res, statusCode, message = 'Something went wrong', error = null) => {
    const response = {
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && error && { error: error.stack })
    };

    res.status(statusCode).json(response);
};

// Pagination helper
const getPaginationData = (page = 1, limit = 10, total) => {
    const currentPage = Math.max(1, parseInt(page));
    const itemsPerPage = Math.max(1, parseInt(limit));
    const totalPages = Math.ceil(total / itemsPerPage);
    const skip = (currentPage - 1) * itemsPerPage;

    return {
        currentPage,
        totalPages,
        itemsPerPage,
        skip,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
        prevPage: currentPage > 1 ? currentPage - 1 : null,
        total
    };
};

// Generate random string
const generateRandomString = (length = 10) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// Format file size
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Sanitize filename
const sanitizeFilename = (filename) => {
    return filename.replace(/[^a-z0-9.-]/gi, '_').toLowerCase();
};

// Check if file is image
const isImageFile = (mimetype) => {
    return mimetype.startsWith('image/');
};

// Check if file is document
const isDocumentFile = (mimetype) => {
    const documentTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/rtf'
    ];
    return documentTypes.includes(mimetype);
};

module.exports = {
    sendSuccessResponse,
    sendErrorResponse,
    getPaginationData,
    generateRandomString,
    formatFileSize,
    sanitizeFilename,
    isImageFile,
    isDocumentFile
};