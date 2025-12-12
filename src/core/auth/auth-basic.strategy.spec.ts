import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BasicStrategy } from './auth-basic.strategy';

describe('BasicStrategy', () => {
  let strategy: BasicStrategy;
  let mockConfigService: Partial<ConfigService>;

  beforeEach(() => {
    mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'HTTP_BASIC_USER') return 'testUser';
        if (key === 'HTTP_BASIC_PASS') return 'testPass';
        return null;
      }),
    };
    strategy = new BasicStrategy(mockConfigService as ConfigService);
  });

  describe('validate', () => {
    it('should return true for valid credentials', async () => {
      const result = await strategy.validate(null, 'testUser', 'testPass');
      expect(result).toBe(true);
    });

    it('should throw UnauthorizedException for invalid username', async () => {
      await expect(strategy.validate(null, 'wrongUser', 'testPass')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      await expect(strategy.validate(null, 'testUser', 'wrongPass')).rejects.toThrow(UnauthorizedException);
    });
  });
});