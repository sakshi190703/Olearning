const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You must be logged in to access this page.');
    res.redirect('/login');
};

const isStudent = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'student') {
        return next();
    }
    req.flash('error', 'Access denied. Students only.');
    res.redirect('/login');
};

const isInstructor = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'instructor') {
        return next();
    }
    req.flash('error', 'Access denied. Instructors only.');
    res.redirect('/login');
};

const isGuest = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    
    const redirectUrl = req.user.role === 'instructor' 
        ? '/instructor/dashboard' 
        : '/student/dashboard';
    res.redirect(redirectUrl);
};

const checkOwnership = (Model, paramName = 'id') => {
    return async (req, res, next) => {
        try {
            const resource = await Model.findById(req.params[paramName]);
            
            if (!resource) {
                req.flash('error', 'Resource not found.');
                return res.redirect('back');
            }
            
            if (!resource.createdBy.equals(req.user._id)) {
                req.flash('error', 'You do not have permission to perform this action.');
                return res.redirect('back');
            }
            
            req.resource = resource;
            next();
        } catch (error) {
            req.flash('error', 'An error occurred while checking permissions.');
            res.redirect('back');
        }
    };
};

module.exports = {
    isAuthenticated,
    isStudent,
    isInstructor,
    isGuest,
    checkOwnership
};