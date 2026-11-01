const request = require('supertest');
const app = require('../server');

describe('Task Management API - CI/CD Automated Test Suite', () => {

    // Test 1: Verify Root / Healthcheck endpoint (Deliberately broken test for CI failure demonstration)
    it('GET / should return 200 OK and running status message', async () => {
        const response = await request(app).get('/');
        // DELIBERATE FAILURE: Expecting status 500 instead of 200 to test pipeline failure behavior
        expect(response.statusCode).toBe(500);
        expect(response.text).toContain('Task Manager API is running...');
    });

    // Test 2: Verify Cache Stats endpoint (Practical 9 & Supplementary requirement)
    it('GET /cache/stats should return 200 OK and metrics object', async () => {
        const response = await request(app).get('/cache/stats');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('hits');
        expect(response.body).toHaveProperty('misses');
    });

    // Test 3: Verify Security / Auth Guard on /tasks
    it('GET /tasks without token should be rejected with 401 Unauthorized', async () => {
        const response = await request(app).get('/tasks');
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('error');
    });

    // Test 4: Verify 404 handler for undefined routes
    it('GET /api/nonexistent-route should return 404 Route not found', async () => {
        const response = await request(app).get('/api/nonexistent-route');
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe('Route not found');
    });

});
