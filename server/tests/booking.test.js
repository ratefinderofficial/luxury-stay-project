const request = require('supertest');
const app = require('../server');
const Room = require('../models/Room');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
require('./setup');

describe('Booking Endpoints', () => {
    let guestToken;
    let roomId;
    let guestId;

    beforeEach(async () => {
        // 1. Create Guest
        const guest = await User.create({ name: 'Booker', email: 'book@test.com', password: '123', role: 'Guest' });
        guestId = guest._id;
        guestToken = generateToken(guest._id);

        // 2. Create Room
        const room = await Room.create({ roomNumber: '205', type: 'Suite', price: 500, capacity: 4 });
        roomId = room._id;
    });

    // Test: Successful Booking
    it('should create a booking successfully', async () => {
        const res = await request(app)
            .post('/api/bookings')
            .set('Authorization', `Bearer ${guestToken}`)
            .send({
                roomId: roomId,
                guestId: guestId,
                checkIn: '2025-12-01',
                checkOut: '2025-12-05'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.status).toEqual('Confirmed');
    });

    // Test: Double Booking Logic
    it('should prevent booking overlaps', async () => {
        // First Booking
        await request(app)
            .post('/api/bookings')
            .set('Authorization', `Bearer ${guestToken}`)
            .send({
                roomId: roomId,
                guestId: guestId,
                checkIn: '2025-12-01',
                checkOut: '2025-12-05'
            });

        // Try booking same dates again
        const res = await request(app)
            .post('/api/bookings')
            .set('Authorization', `Bearer ${guestToken}`)
            .send({
                roomId: roomId,
                guestId: guestId,
                checkIn: '2025-12-02', // Overlaps
                checkOut: '2025-12-06'
            });

        expect(res.statusCode).toEqual(400); // Should fail
        expect(res.body.message).toContain('already booked');
    });
});