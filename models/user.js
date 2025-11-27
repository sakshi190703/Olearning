const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'instructor'],
        required: true
    },
    bio: String,
    avatar: String,
    enrolledCourses: [{
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Listing'
        },
        enrollmentDate: {
            type: Date,
            default: Date.now
        }
    }],
    submittedAssignments: [{
        assignment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Assignment'
        },
        submission: String,
        score: Number,
        gradedAt: Date,
        submittedAt: {
            type: Date,
            default: Date.now
        }
    }],
    testScores: [{
        test: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Test'
        },
        answers: [{
            question: String, // Store the question text or ID
            selectedAnswer: String // Store the student's selected option
          }],
        score: Number,
        gradedAt: Date,
        submittedAt: {
            type: Date,
            default: Date.now
          }
    }]
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

module.exports = mongoose.model('User', userSchema);