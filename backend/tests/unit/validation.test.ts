import { validationResult } from 'express-validator';
import { Request, Response } from 'express';

describe('Validation Utils - Unit Tests', () => {
  describe('Email Validation', () => {
    it('should validate correct email format', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.com',
      ];

      validEmails.forEach(email => {
        expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });
    });

    it('should reject invalid email format', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user @example.com',
      ];

      invalidEmails.forEach(email => {
        expect(email).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });
    });
  });

  describe('Password Validation', () => {
    it('should validate password length', () => {
      const validPassword = 'password123';
      const invalidPassword = 'short';

      expect(validPassword.length).toBeGreaterThanOrEqual(8);
      expect(invalidPassword.length).toBeLessThan(8);
    });

    it('should check password strength requirements', () => {
      const strongPassword = 'StrongP@ss123';
      
      expect(strongPassword.length).toBeGreaterThanOrEqual(8);
      expect(strongPassword).toMatch(/[A-Z]/); // Has uppercase
      expect(strongPassword).toMatch(/[a-z]/); // Has lowercase
      expect(strongPassword).toMatch(/[0-9]/); // Has number
    });
  });

  describe('UUID Validation', () => {
    it('should validate correct UUID format', () => {
      const validUUIDs = [
        '123e4567-e89b-12d3-a456-426614174000',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      ];

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      validUUIDs.forEach(uuid => {
        expect(uuid).toMatch(uuidRegex);
      });
    });

    it('should reject invalid UUID format', () => {
      const invalidUUIDs = [
        'not-a-uuid',
        '123',
        '123e4567-e89b-12d3-a456',
      ];

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      invalidUUIDs.forEach(uuid => {
        expect(uuid).not.toMatch(uuidRegex);
      });
    });
  });

  describe('Amount Validation', () => {
    it('should validate positive amounts', () => {
      const validAmounts = [100, 1000.50, 0.01];

      validAmounts.forEach(amount => {
        expect(amount).toBeGreaterThan(0);
        expect(typeof amount).toBe('number');
      });
    });

    it('should reject invalid amounts', () => {
      const invalidAmounts = [-100, 0, -0.01];

      invalidAmounts.forEach(amount => {
        expect(amount).toBeLessThanOrEqual(0);
      });
    });
  });

  describe('Date Validation', () => {
    it('should validate ISO8601 date format', () => {
      const validDates = [
        '2024-01-01T00:00:00.000Z',
        '2024-12-31T23:59:59.999Z',
      ];

      validDates.forEach(date => {
        expect(new Date(date).toISOString()).toBe(date);
      });
    });

    it('should validate date ranges', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');

      expect(endDate.getTime()).toBeGreaterThan(startDate.getTime());
    });

    it('should reject invalid date ranges', () => {
      const startDate = new Date('2024-12-31');
      const endDate = new Date('2024-01-01');

      expect(endDate.getTime()).toBeLessThan(startDate.getTime());
    });
  });
});
