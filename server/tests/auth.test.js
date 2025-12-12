const request = require('supertest');
const app = require('../server'); // Ensure server.js exports 'app'
require('./setup'); // Import DB setup

describe('Auth Endpoints', () => {
    
    // Test Registration
    it('should register a new user successfully', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'test@luxurystay.com',
                password: 'password123',
                phone: '1234567890'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('email', 'test@luxurystay.com');
    });

    // Test Login
    it('should login an existing user', async () => {
        // 1. Create User first
        await request(app).post('/api/auth/register').send({
            name: 'Login User',
            email: 'login@luxurystay.com',
            password: 'password123'
        });

        // 2. Try Login
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'login@luxurystay.com',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    // Test Invalid Login
    it('should reject invalid credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'wrong@email.com',
                password: 'wrongpassword'
            });

        expect(res.statusCode).toEqual(401);
    });
});