const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Connect to a specific TEST Database
beforeAll(async () => {
    const testURI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/luxurystay_test_db';
    await mongoose.connect(testURI);
});

// Clean up database after each test suite
afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

// Close connection after all tests
afterAll(async () => {
    await mongoose.connection.close();
});