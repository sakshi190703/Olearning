const Assignment = require('../models/assignment');
const User = require('../models/user');

class AssignmentService {
    async createAssignment(assignmentData) {
        try {
            const assignment = new Assignment(assignmentData);
            return await assignment.save();
        } catch (error) {
            throw new Error(`Failed to create assignment: ${error.message}`);
        }
    }

    async getAssignmentById(id) {
        try {
            return await Assignment.findById(id)
                .populate('course', 'title instructor')
                .populate('createdBy', 'username email');
        } catch (error) {
            throw new Error(`Failed to get assignment: ${error.message}`);
        }
    }

    async getAssignmentsByCourse(courseId) {
        try {
            return await Assignment.find({ course: courseId })
                .populate('createdBy', 'username email')
                .sort({ _id: -1 });
        } catch (error) {
            throw new Error(`Failed to get course assignments: ${error.message}`);
        }
    }

    async updateAssignment(id, updateData) {
        try {
            return await Assignment.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true
            });
        } catch (error) {
            throw new Error(`Failed to update assignment: ${error.message}`);
        }
    }

    async deleteAssignment(id) {
        try {
            return await Assignment.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Failed to delete assignment: ${error.message}`);
        }
    }

    async getStudentSubmissions(assignmentId) {
        try {
            const students = await User.find({
                role: 'student',
                'submittedAssignments.assignment': assignmentId
            }).populate('submittedAssignments.assignment');
            
            return students.map(student => {
                const submission = student.submittedAssignments.find(
                    sub => sub.assignment._id.toString() === assignmentId
                );
                
                return {
                    student: {
                        _id: student._id,
                        username: student.username,
                        email: student.email
                    },
                    submission
                };
            });
        } catch (error) {
            throw new Error(`Failed to get student submissions: ${error.message}`);
        }
    }

    async getStudentSubmission(studentId, assignmentId) {
        try {
            const student = await User.findById(studentId);
            if (!student) {
                throw new Error('Student not found');
            }
            
            return student.submittedAssignments.find(
                sub => sub.assignment.toString() === assignmentId
            );
        } catch (error) {
            throw new Error(`Failed to get student submission: ${error.message}`);
        }
    }
}

module.exports = new AssignmentService();