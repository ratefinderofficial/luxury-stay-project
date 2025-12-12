const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const generateToken = require('../utils/generateToken'); // Helper to make fake tokens
require('./setup');

describe('Room Endpoints', () => {
    let adminToken;
    let guestToken;

    // Create Dummy Users for Tokens
    beforeEach(async () => {
        const admin = await User.create({ name: 'Admin', email: 'admin@test.com', password: '123', role: 'Admin' });
        adminToken = generateToken(admin._id);

        const guest = await User.create({ name: 'Guest', email: 'guest@test.com', password: '123', role: 'Guest' });
        guestToken = generateToken(guest._id);
    });

    // Test: Public can see rooms
    it('should fetch all rooms (Public)', async () => {
        const res = await request(app).get('/api/rooms');
        expect(res.statusCode).toEqual(200);
    });

    // Test: Admin can create room
    it('should allow Admin to create a room', async () => {
        const res = await request(app)
            .post('/api/rooms')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                roomNumber: '101',
                type: 'Deluxe',
                price: 200,
                capacity: 2,
                description: 'A test room'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.roomNumber).toEqual('101');
    });

    // Test: Guest CANNOT create room (Security Check)
    it('should deny Guest from creating a room', async () => {
        const res = await request(app)
            .post('/api/rooms')
            .set('Authorization', `Bearer ${guestToken}`)
            .send({
                roomNumber: '102',
                type: 'Standard',
                price: 100
            });

        expect(res.statusCode).toEqual(403); // Forbidden
    });
});