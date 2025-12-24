const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
require('./setup');

describe('User Management Endpoints', () => {
    let adminToken;
    let guestToken;

    beforeEach(async () => {
        const admin = await User.create({ name: 'Admin', email: 'admin@test.com', password: '123', role: 'Admin' });
        adminToken = generateToken(admin._id);

        const guest = await User.create({ name: 'Guest', email: 'guest@test.com', password: '123', role: 'Guest' });
        guestToken = generateToken(guest._id);
    });

    // Test: Admin accessing user list
    it('should allow Admin to view all users', async () => {
        const res = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // Test: Guest trying to access user list
    it('should deny Guest from viewing all users', async () => {
        const res = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${guestToken}`);

        expect(res.statusCode).toEqual(403); // Forbidden
    });
});