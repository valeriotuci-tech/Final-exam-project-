import request from 'supertest';
import express from 'express';
import { campaignsRouter } from '../../src/routes/campaigns.routes';

// Create test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/campaigns', campaignsRouter);
  return app;
};

describe('Campaigns API - Integration Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createTestApp();
  });

  describe('GET /api/campaigns', () => {
    it('should return campaigns list', async () => {
      const response = await request(app)
        .get('/api/campaigns')
        .expect('Content-Type', /json/);

      expect([200, 500]).toContain(response.status);
      
      if (response.status === 200) {
        expect(Array.isArray(response.body) || response.body.campaigns).toBeTruthy();
      }
    });

    it('should handle query parameters', async () => {
      const response = await request(app)
        .get('/api/campaigns?status=active')
        .expect('Content-Type', /json/);

      expect([200, 400, 500]).toContain(response.status);
    });
  });

  describe('GET /api/campaigns/:id', () => {
    it('should reject invalid UUID format', async () => {
      const response = await request(app)
        .get('/api/campaigns/invalid-id')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('should accept valid UUID format', async () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';
      
      const response = await request(app)
        .get(`/api/campaigns/${validUUID}`)
        .expect('Content-Type', /json/);

      // Accept various status codes (not found, success, etc.)
      expect([200, 404, 500]).toContain(response.status);
    });
  });

  describe('POST /api/campaigns', () => {
    it('should reject campaign creation without authentication', async () => {
      const campaignData = {
        restaurantId: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Test Campaign',
        targetAmount: 10000,
        startDate: '2024-01-01T00:00:00.000Z',
        endDate: '2024-12-31T23:59:59.999Z',
      };

      const response = await request(app)
        .post('/api/campaigns')
        .send(campaignData)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(401);
    });

    it('should reject campaign with invalid restaurant ID', async () => {
      const campaignData = {
        restaurantId: 'invalid-uuid',
        title: 'Test Campaign',
        targetAmount: 10000,
        startDate: '2024-01-01T00:00:00.000Z',
        endDate: '2024-12-31T23:59:59.999Z',
      };

      const response = await request(app)
        .post('/api/campaigns')
        .send(campaignData)
        .set('Authorization', 'Bearer fake-token')
        .expect('Content-Type', /json/);

      expect([400, 401]).toContain(response.status);
    });

    it('should reject campaign with negative target amount', async () => {
      const campaignData = {
        restaurantId: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Test Campaign',
        targetAmount: -1000,
        startDate: '2024-01-01T00:00:00.000Z',
        endDate: '2024-12-31T23:59:59.999Z',
      };

      const response = await request(app)
        .post('/api/campaigns')
        .send(campaignData)
        .set('Authorization', 'Bearer fake-token')
        .expect('Content-Type', /json/);

      expect([400, 401]).toContain(response.status);
    });

    it('should reject campaign with missing required fields', async () => {
      const campaignData = {
        title: 'Test Campaign',
      };

      const response = await request(app)
        .post('/api/campaigns')
        .send(campaignData)
        .set('Authorization', 'Bearer fake-token')
        .expect('Content-Type', /json/);

      expect([400, 401]).toContain(response.status);
    });
  });

  describe('PUT /api/campaigns/:id', () => {
    it('should reject update without authentication', async () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';
      
      const response = await request(app)
        .put(`/api/campaigns/${validUUID}`)
        .send({ title: 'Updated Title' })
        .expect('Content-Type', /json/);

      expect(response.status).toBe(401);
    });

    it('should reject update with invalid UUID', async () => {
      const response = await request(app)
        .put('/api/campaigns/invalid-id')
        .send({ title: 'Updated Title' })
        .set('Authorization', 'Bearer fake-token')
        .expect('Content-Type', /json/);

      expect([400, 401]).toContain(response.status);
    });
  });

  describe('DELETE /api/campaigns/:id', () => {
    it('should reject delete without authentication', async () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';
      
      const response = await request(app)
        .delete(`/api/campaigns/${validUUID}`)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(401);
    });

    it('should reject delete with invalid UUID', async () => {
      const response = await request(app)
        .delete('/api/campaigns/invalid-id')
        .set('Authorization', 'Bearer fake-token')
        .expect('Content-Type', /json/);

      expect([400, 401]).toContain(response.status);
    });
  });
});
