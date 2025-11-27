require('dotenv').config();
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

// Import configurations
const database = require('./config/database');
const passportConfig = require('./config/passport');

// Import routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const instructorRoutes = require('./routes/instructor');
const homeController = require('./controllers/homeController');

// Import middleware
const { errorHandler, notFound } = require('./middleware/error');
const logger = require('./utils/logger');

const app = express();

// Connect to MongoDB
database.connect();

// Express Configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

// Body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(methodOverride('_method'));

// Static file serving
app.use(express.static(path.join(__dirname, 'public')));

// Trust proxy for deployed environments
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// Session Configuration
const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'Sakshi@123',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGO_URL,
        touchAfter: 24 * 3600 // lazy session update
    }),
    cookie: {
        name: 'elearning.sid',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
    }
};

app.use(session(sessionConfig));

// Flash messages
app.use(flash());

// Passport Configuration
app.use(passportConfig.initialize());
app.use(passportConfig.session());

// Global middleware for locals
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    res.locals.req = req; // Make request object available in templates
    next();
});

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        logger.info(`${req.method} ${req.originalUrl}`, {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            user: req.user ? req.user.email : 'Guest'
        });
        next();
    });
}

// Routes
app.get('/', homeController.home);
app.use('/', authRoutes);
app.use('/student', studentRoutes);
app.use('/instructor', instructorRoutes);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = () => {
    logger.info('Received kill signal, shutting down gracefully...');
    
    server.close(() => {
        logger.info('Closed out remaining connections.');
        database.disconnect();
        process.exit(0);
    });

    setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 30000);
};

// Start Server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    logger.info(`🚀 Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Handle process termination
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    gracefulShutdown();
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown();
});

module.exports = app;