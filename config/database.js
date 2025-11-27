const mongoose = require('mongoose');

class Database {
    constructor() {
        this.connection = null;
    }

    async connect() {
        try {
            const mongoUrl = process.env.MONGO_URL;
            
            if (!mongoUrl) {
                throw new Error('MongoDB URL not found in environment variables. Please set MONGO_URL in .env');
            }

            this.connection = await mongoose.connect(mongoUrl);

            console.log('✅ Connected to MongoDB');
            return this.connection;
        } catch (error) {
            console.error('❌ MongoDB connection error:', error);
            process.exit(1);
        }
    }

    async disconnect() {
        try {
            await mongoose.connection.close();
            console.log('🔌 Disconnected from MongoDB');
        } catch (error) {
            console.error('❌ Error disconnecting from MongoDB:', error);
        }
    }

    getConnection() {
        return this.connection;
    }
}

module.exports = new Database();