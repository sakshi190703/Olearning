const Test = require('../models/test');
const User = require('../models/user');

class TestService {
    async createTest(testData) {
        try {
            const test = new Test(testData);
            return await test.save();
        } catch (error) {
            throw new Error(`Failed to create test: ${error.message}`);
        }
    }

    async getTestById(id) {
        try {
            return await Test.findById(id)
                .populate('course', 'title instructor')
                .populate('createdBy', 'username email');
        } catch (error) {
            throw new Error(`Failed to get test: ${error.message}`);
        }
    }

    async getTestsByCourse(courseId) {
        try {
            return await Test.find({ course: courseId })
                .populate('createdBy', 'username email')
                .sort({ _id: -1 });
        } catch (error) {
            throw new Error(`Failed to get course tests: ${error.message}`);
        }
    }

    async updateTest(id, updateData) {
        try {
            return await Test.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true
            });
        } catch (error) {
            throw new Error(`Failed to update test: ${error.message}`);
        }
    }

    async deleteTest(id) {
        try {
            return await Test.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Failed to delete test: ${error.message}`);
        }
    }

    async calculateScore(testId, answers) {
        try {
            const test = await Test.findById(testId);
            if (!test) {
                throw new Error('Test not found');
            }

            let score = 0;
            const formattedAnswers = test.questions.map((question, index) => {
                const selectedAnswer = answers[index];
                if (selectedAnswer === question.correctAnswer) {
                    score += 1;
                }
                
                return {
                    questionId: question._id,
                    selectedAnswer: selectedAnswer || null
                };
            });

            const percentage = (score / test.questions.length) * 100;
            
            return {
                score: percentage,
                answers: formattedAnswers,
                totalQuestions: test.questions.length,
                correctAnswers: score
            };
        } catch (error) {
            throw new Error(`Failed to calculate score: ${error.message}`);
        }
    }

    async getStudentAttempts(testId) {
        try {
            const students = await User.find({
                role: 'student',
                'testScores.test': testId
            }).populate('testScores.test');
            
            return students.map(student => {
                const attempt = student.testScores.find(
                    score => score.test._id.toString() === testId
                );
                
                return {
                    student: {
                        _id: student._id,
                        username: student.username,
                        email: student.email
                    },
                    attempt
                };
            });
        } catch (error) {
            throw new Error(`Failed to get student attempts: ${error.message}`);
        }
    }

    async getStudentAttempt(studentId, testId) {
        try {
            const student = await User.findById(studentId);
            if (!student) {
                throw new Error('Student not found');
            }
            
            return student.testScores.find(
                score => score.test.toString() === testId
            );
        } catch (error) {
            throw new Error(`Failed to get student attempt: ${error.message}`);
        }
    }
}

module.exports = new TestService();