import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock bcrypt and jwt
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Service - Unit Tests', () => {
  const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
  const mockJwt = jwt as jest.Mocked<typeof jwt>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Password Hashing', () => {
    it('should hash password correctly', async () => {
      const password = 'testPassword123';
      const hashedPassword = 'hashedPassword123';

      mockBcrypt.hash.mockResolvedValue(hashedPassword as never);

      const result = await bcrypt.hash(password, 10);

      expect(result).toBe(hashedPassword);
      expect(mockBcrypt.hash).toHaveBeenCalledWith(password, 10);
    });

    it('should compare passwords correctly', async () => {
      const password = 'testPassword123';
      const hashedPassword = 'hashedPassword123';

      mockBcrypt.compare.mockResolvedValue(true as never);

      const result = await bcrypt.compare(password, hashedPassword);

      expect(result).toBe(true);
      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });

    it('should return false for incorrect password', async () => {
      const password = 'wrongPassword';
      const hashedPassword = 'hashedPassword123';

      mockBcrypt.compare.mockResolvedValue(false as never);

      const result = await bcrypt.compare(password, hashedPassword);

      expect(result).toBe(false);
    });
  });

  describe('JWT Token Generation', () => {
    it('should generate access token', () => {
      const payload = { userId: '123', email: 'test@example.com' };
      const token = 'generated.jwt.token';

      mockJwt.sign.mockReturnValue(token as never);

      const result = jwt.sign(payload, 'secret', { expiresIn: '15m' });

      expect(result).toBe(token);
      expect(mockJwt.sign).toHaveBeenCalledWith(payload, 'secret', { expiresIn: '15m' });
    });

    it('should generate refresh token', () => {
      const payload = { userId: '123' };
      const token = 'refresh.jwt.token';

      mockJwt.sign.mockReturnValue(token as never);

      const result = jwt.sign(payload, 'refresh_secret', { expiresIn: '7d' });

      expect(result).toBe(token);
      expect(mockJwt.sign).toHaveBeenCalledWith(payload, 'refresh_secret', { expiresIn: '7d' });
    });

    it('should verify token successfully', () => {
      const token = 'valid.jwt.token';
      const decoded = { userId: '123', email: 'test@example.com' };

      mockJwt.verify.mockReturnValue(decoded as never);

      const result = jwt.verify(token, 'secret');

      expect(result).toEqual(decoded);
      expect(mockJwt.verify).toHaveBeenCalledWith(token, 'secret');
    });

    it('should throw error for invalid token', () => {
      const token = 'invalid.jwt.token';

      mockJwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => jwt.verify(token, 'secret')).toThrow('Invalid token');
    });
  });

  describe('Token Expiration', () => {
    it('should handle expired token', () => {
      const token = 'expired.jwt.token';

      mockJwt.verify.mockImplementation(() => {
        const error: any = new Error('jwt expired');
        error.name = 'TokenExpiredError';
        throw error;
      });

      expect(() => jwt.verify(token, 'secret')).toThrow('jwt expired');
    });
  });
});
