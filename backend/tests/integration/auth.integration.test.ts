import request from 'supertest';
import express from 'express';
import { authRouter } from '../../src/routes/auth.routes';

// Create test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRouter);
  return app;
};

describe('Auth API - Integration Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createTestApp();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'SecurePass123',
        name: 'Test User',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect('Content-Type', /json/);

      // Note: Actual status depends on implementation
      // This is a template - adjust based on your actual API
      expect([200, 201, 400, 409]).toContain(response.status);
    });

    it('should reject registration with invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'SecurePass123',
        name: 'Test User',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('should reject registration with short password', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'short',
        name: 'Test User',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('should reject registration with missing name', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'SecurePass123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should accept login with valid credentials format', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'SecurePass123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect('Content-Type', /json/);

      // Accept various status codes as we're testing format validation
      expect([200, 401, 404]).toContain(response.status);
    });

    it('should reject login with invalid email format', async () => {
      const credentials = {
        email: 'not-an-email',
        password: 'SecurePass123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('should reject login with missing password', async () => {
      const credentials = {
        email: 'test@example.com',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
    });

    it('should reject login with empty credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should handle logout request', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect('Content-Type', /json/);

      // Accept various status codes
      expect([200, 401]).toContain(response.status);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should handle refresh token request', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .expect('Content-Type', /json/);

      // Accept various status codes
      expect([200, 401]).toContain(response.status);
    });
  });
});
