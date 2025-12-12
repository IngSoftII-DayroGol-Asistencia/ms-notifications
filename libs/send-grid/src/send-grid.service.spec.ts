import { Test, TestingModule } from '@nestjs/testing';
import { SendGridService } from './send-grid.service';
import { HttpException } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

// Mock the sgMail module
jest.mock('@sendgrid/mail');

describe('SendGridService', () => {
  let service: SendGridService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendGridService],
    }).compile();

    service = module.get<SendGridService>(SendGridService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendMail', () => {
    it('should send mail successfully', async () => {
      jest.mocked(sgMail.send).mockResolvedValueOnce([{}] as any);
      const params = {
        to: 'test@example.com',
        from: 'from@example.com',
        subject: 'Test Subject',
        text: 'Test text',
        html: '<p>Test html</p>',
      };

      const result = await service.sendMail(params);
      expect(result).toBe(true);
      expect(jest.mocked(sgMail.send)).toHaveBeenCalledWith(params);
    });

    it('should throw HttpException on error', async () => {
      jest.mocked(sgMail.send).mockRejectedValueOnce(new Error('SendGrid error'));
      const params = {
        to: 'invalid',
        from: 'from@example.com',
        subject: 'Test Subject',
      };

      await expect(service.sendMail(params)).rejects.toThrow(HttpException);
    });
  });

  describe('sendEmailCC', () => {
    it('should send email CC successfully', async () => {
      jest.mocked(sgMail.send).mockResolvedValueOnce([{}] as any);
      const params = {
        to: ['test1@example.com', 'test2@example.com'],
        from: 'from@example.com',
        subject: 'Test Subject',
        text: 'Test text',
        html: '<p>Test html</p>',
      };

      const result = await service.sendEmailCC(params);
      expect(result).toBe(true);
      expect(jest.mocked(sgMail.send)).toHaveBeenCalledWith(params);
    });

    it('should throw HttpException on error', async () => {
      jest.mocked(sgMail.send).mockRejectedValueOnce(new Error('SendGrid error'));
      const params = {
        to: ['invalid'],
        from: 'from@example.com',
        subject: 'Test Subject',
      };

      await expect(service.sendEmailCC(params)).rejects.toThrow(HttpException);
    });
  });
});
