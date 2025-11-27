const Listing = require('../models/listing');
const Assignment = require('../models/assignment');
const Test = require('../models/test');

class CourseService {
    async createCourse(courseData) {
        try {
            const course = new Listing(courseData);
            return await course.save();
        } catch (error) {
            throw new Error(`Failed to create course: ${error.message}`);
        }
    }

    async getAllCourses() {
        try {
            return await Listing.find({})
                .populate('createdBy', 'username email')
                .sort({ _id: -1 });
        } catch (error) {
            throw new Error(`Failed to get courses: ${error.message}`);
        }
    }

    async getCourseById(id) {
        try {
            return await Listing.findById(id)
                .populate('createdBy', 'username email role');
        } catch (error) {
            throw new Error(`Failed to get course: ${error.message}`);
        }
    }

    async getCoursesByInstructor(instructorId) {
        try {
            return await Listing.find({ createdBy: instructorId })
                .populate('createdBy', 'username email')
                .sort({ _id: -1 });
        } catch (error) {
            throw new Error(`Failed to get instructor courses: ${error.message}`);
        }
    }

    async updateCourse(id, updateData) {
        try {
            return await Listing.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true
            });
        } catch (error) {
            throw new Error(`Failed to update course: ${error.message}`);
        }
    }

    async deleteCourse(id) {
        try {
            // Delete associated assignments and tests
            await Assignment.deleteMany({ course: id });
            await Test.deleteMany({ course: id });
            
            return await Listing.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Failed to delete course: ${error.message}`);
        }
    }

    async getCourseWithContent(id) {
        try {
            const course = await this.getCourseById(id);
            const assignments = await Assignment.find({ course: id }).sort({ _id: -1 });
            const tests = await Test.find({ course: id }).sort({ _id: -1 });
            
            return {
                course,
                assignments,
                tests
            };
        } catch (error) {
            throw new Error(`Failed to get course with content: ${error.message}`);
        }
    }
}

module.exports = new CourseService();