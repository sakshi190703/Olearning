# E-Learning Platform - Modern Architecture

A modern, scalable e-learning platform built with Node.js, Express, and MongoDB following MVC architecture patterns.

## 🏗️ Project Structure

```
├── app.js                      # Application entry point
├── config/                     # Configuration files
│   ├── database.js            # Database connection config
│   ├── passport.js            # Passport authentication config
│   └── multer.js              # File upload configuration
├── controllers/                # Route controllers (business logic)
│   ├── authController.js      # Authentication logic
│   ├── homeController.js      # Home page logic
│   ├── instructorController.js # Instructor functionality
│   └── studentController.js   # Student functionality
├── middleware/                 # Custom middleware
│   ├── auth.js               # Authentication middleware
│   ├── error.js              # Error handling middleware
│   └── validation.js         # Validation middleware
├── models/                    # MongoDB schemas
│   ├── assignment.js         # Assignment model
│   ├── listing.js           # Course model
│   ├── test.js              # Test model
│   └── user.js              # User model
├── routes/                   # Route definitions
│   ├── auth.js              # Authentication routes
│   ├── instructor.js        # Instructor routes
│   └── student.js           # Student routes
├── services/                # Business logic layer
│   ├── assignmentService.js # Assignment business logic
│   ├── courseService.js     # Course business logic
│   ├── testService.js       # Test business logic
│   └── userService.js       # User business logic
├── utils/                   # Utility functions
│   ├── AppError.js         # Custom error class
│   ├── helpers.js          # Helper functions
│   └── logger.js           # Winston logger configuration
├── validators/             # Input validation rules
│   ├── authValidators.js   # Authentication validation
│   └── courseValidators.js # Course validation
├── views/                  # EJS templates
├── public/                 # Static assets
├── uploads/               # File uploads directory
└── logs/                  # Application logs
```

## 🚀 Features

### Core Features
- **Modern MVC Architecture**: Clean separation of concerns
- **Secure Authentication**: bcrypt password hashing, session management
- **Role-based Access Control**: Student and Instructor roles
- **File Upload Management**: Organized file storage with validation
- **Input Validation**: Comprehensive server-side validation
- **Error Handling**: Centralized error management with logging
- **Security**: CSRF protection, secure sessions, input sanitization

### User Features
- **Students**: Course enrollment, assignment submission, test taking
- **Instructors**: Course creation, assignment/test management, grading
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js with Local Strategy
- **Validation**: express-validator
- **File Upload**: Multer with organized storage
- **Logging**: Winston
- **Template Engine**: EJS with EJS-Mate
- **Styling**: Bootstrap 5 + Custom CSS
- **Session Management**: express-session with MongoDB store

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eLearningPlatform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install additional dependencies for modern features**
   ```bash
   npm install express-validator winston nodemon --save-dev eslint prettier
   ```

4. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   MONGO_URL=mongodb://localhost:27017/elearning
   SESSION_SECRET=your_session_secret_here
   NODE_ENV=development
   PORT=3000
   LOG_LEVEL=info
   ```

5. **Start the application**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔧 Configuration

### Database Configuration
The database configuration is centralized in `config/database.js` with proper connection handling and graceful disconnection.

### File Upload Configuration
File uploads are configured in `config/multer.js` with:
- Organized storage (separate folders for courses, assignments)
- File type validation
- Size limits
- Secure filename generation

### Logging Configuration
Winston logger is configured in `utils/logger.js` with:
- File-based logging (error.log, combined.log)
- Console logging in development
- Log rotation and size management

## 🛡️ Security Features

1. **Password Security**: bcrypt hashing with salt rounds
2. **Session Security**: Secure session configuration with MongoDB store
3. **Input Validation**: express-validator for all inputs
4. **File Upload Security**: File type and size validation
5. **Error Handling**: No sensitive information exposure
6. **CSRF Protection**: Built into session management

## 📝 API Endpoints

### Authentication Routes
- `GET /login` - Login page
- `POST /login` - User login
- `GET /signup` - Registration page
- `POST /signup` - User registration
- `GET /logout` - User logout

### Student Routes
- `GET /student/dashboard` - Student dashboard
- `GET /student/listings` - Course listings
- `POST /student/courses/:id/enroll` - Enroll in course
- `GET /student/assignments/:id/submit` - Assignment submission form
- `POST /student/assignments/:id/submit` - Submit assignment
- `GET /student/tests/:id/take` - Take test
- `POST /student/tests/:id/submit` - Submit test

### Instructor Routes
- `GET /instructor/dashboard` - Instructor dashboard
- `GET /instructor/courses/new` - Create course form
- `POST /instructor/courses/new` - Create course
- `GET /instructor/courses/:id/edit` - Edit course form
- `PUT /instructor/courses/:id` - Update course
- `DELETE /instructor/courses/:id` - Delete course
- `GET /instructor/assignments/:id/grade` - Grade assignments
- `GET /instructor/tests/:id/grade` - Grade tests

## 🧪 Validation Rules

### User Registration
- Email: Valid email format, normalized
- Username: 2-50 characters, alphanumeric + spaces + underscores
- Password: Min 6 characters, must contain uppercase, lowercase, and number
- Role: Must be 'student' or 'instructor'

### Course Creation
- Title: 3-100 characters
- Instructor: 2-50 characters
- Description: 10-1000 characters
- Price: Positive number

### Assignment/Test Creation
- Title: 3-100 characters
- Description: 10-2000 characters (assignments), 5-500 characters (test questions)
- Test questions: 1-6 options, must have correct answer

## 🔍 Error Handling

Centralized error handling with:
- Custom `AppError` class for operational errors
- Global error handler middleware
- Request logging and error tracking
- User-friendly error messages
- Development vs production error responses

## 📊 Logging

Winston logging configuration:
- **Error logs**: `logs/error.log`
- **Combined logs**: `logs/combined.log`
- **Console logs**: Development environment only
- **Log rotation**: 5MB max file size, 5 file rotation

## 🚀 Deployment

### Production Checklist
1. Set `NODE_ENV=production`
2. Use strong `SESSION_SECRET`
3. Configure proper MongoDB connection string
4. Set up reverse proxy (nginx)
5. Enable HTTPS
6. Configure log monitoring
7. Set up database backups

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Follow the established MVC pattern
2. Add proper validation for new endpoints
3. Include error handling for all operations
4. Write meaningful commit messages
5. Test thoroughly before submitting PRs

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please create an issue in the repository or contact the development team.

---

**Note**: This is a modernized version of the original e-learning platform, restructured to follow current Node.js best practices and design patterns.