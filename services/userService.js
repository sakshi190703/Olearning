const User = require('../models/user');
const bcrypt = require('bcrypt');

class UserService {
    async createUser(userData) {
        try {
            // Hash password before saving
            if (userData.password) {
                const saltRounds = 12;
                userData.password = await bcrypt.hash(userData.password, saltRounds);
            }
            
            const user = new User(userData);
            return await user.save();
        } catch (error) {
            throw new Error(`Failed to create user: ${error.message}`);
        }
    }

    async findUserByEmail(email) {
        try {
            return await User.findOne({ email }).lean();
        } catch (error) {
            throw new Error(`Failed to find user: ${error.message}`);
        }
    }

    async findUserById(id) {
        try {
            return await User.findById(id);
        } catch (error) {
            throw new Error(`Failed to find user: ${error.message}`);
        }
    }

    async updateUser(id, updateData) {
        try {
            // Hash password if it's being updated
            if (updateData.password) {
                const saltRounds = 12;
                updateData.password = await bcrypt.hash(updateData.password, saltRounds);
            }
            
            return await User.findByIdAndUpdate(id, updateData, { 
                new: true, 
                runValidators: true 
            });
        } catch (error) {
            throw new Error(`Failed to update user: ${error.message}`);
        }
    }

    async deleteUser(id) {
        try {
            return await User.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Failed to delete user: ${error.message}`);
        }
    }

    async enrollUserInCourse(userId, courseId) {
        try {
            const user = await User.findById(userId);
            
            if (user.enrolledCourses.some(ec => ec.course.toString() === courseId)) {
                throw new Error('User already enrolled in this course');
            }
            
            user.enrolledCourses.push({ course: courseId });
            return await user.save();
        } catch (error) {
            throw new Error(`Failed to enroll user: ${error.message}`);
        }
    }

    async unenrollUserFromCourse(userId, courseId) {
        try {
            return await User.findByIdAndUpdate(userId, {
                $pull: { enrolledCourses: { course: courseId } }
            });
        } catch (error) {
            throw new Error(`Failed to unenroll user: ${error.message}`);
        }
    }

    async submitAssignment(userId, assignmentId, submission) {
        try {
            const user = await User.findById(userId);
            
            // Check for existing submission
            const existingSubmission = user.submittedAssignments.find(
                sub => sub.assignment.equals(assignmentId)
            );
            
            if (existingSubmission) {
                throw new Error('Assignment already submitted');
            }
            
            return await User.findByIdAndUpdate(userId, {
                $push: {
                    submittedAssignments: {
                        assignment: assignmentId,
                        submission,
                        submittedAt: new Date()
                    }
                }
            });
        } catch (error) {
            throw new Error(`Failed to submit assignment: ${error.message}`);
        }
    }

    async submitTest(userId, testId, answers, score) {
        try {
            return await User.findByIdAndUpdate(userId, {
                $push: {
                    testScores: {
                        test: testId,
                        score,
                        answers,
                        submittedAt: new Date(),
                        gradedAt: new Date()
                    }
                }
            });
        } catch (error) {
            throw new Error(`Failed to submit test: ${error.message}`);
        }
    }

    async gradeAssignment(studentId, assignmentId, score) {
        try {
            return await User.findByIdAndUpdate(studentId, {
                $set: {
                    'submittedAssignments.$[elem].score': score,
                    'submittedAssignments.$[elem].gradedAt': new Date()
                }
            }, {
                arrayFilters: [{ 'elem.assignment': assignmentId }]
            });
        } catch (error) {
            throw new Error(`Failed to grade assignment: ${error.message}`);
        }
    }

    async gradeTest(studentId, testId, score) {
        try {
            return await User.findByIdAndUpdate(studentId, {
                $set: {
                    'testScores.$[elem].score': score,
                    'testScores.$[elem].gradedAt': new Date()
                }
            }, {
                arrayFilters: [{ 'elem.test': testId }]
            });
        } catch (error) {
            throw new Error(`Failed to grade test: ${error.message}`);
        }
    }
}

module.exports = new UserService();