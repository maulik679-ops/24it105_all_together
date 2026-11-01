const request = require('supertest');
const app = require('../server');

describe('Task Management API - CI/CD Automated Test Suite', () => {

    // Test 1: Verify Root / Healthcheck endpoint
    it('GET / should return 200 OK and running status message', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
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
        expect(response.body).toHaveProperty('error');
    });

    // Test 5: Verify AI Task Description Generator endpoint with graceful degradation (Practical 13)
    it('POST /api/ai/generate-description should return 200 with generated description', async () => {
        const response = await request(app)
            .post('/api/ai/generate-description')
            .send({ title: 'Setup GitHub Actions CI Pipeline' });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('description');
        expect(response.body).toHaveProperty('fallback');
    }, 15000);

});
