import { Test, TestingModule } from '@nestjs/testing';
import { EmailsController } from './emails.controller';
import { EmailsService } from './emails.service';

describe('EmailsController', () => {
  let controller: EmailsController;
  let mockEmailsService: Partial<EmailsService>;

  beforeEach(async () => {
    mockEmailsService = {
      send: jest.fn(),
      sendEmails: jest.fn(),
      sendEmailCC: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailsController],
      providers: [{ provide: EmailsService, useValue: mockEmailsService }],
    }).compile();

    controller = module.get<EmailsController>(EmailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sendEmail', () => {
    it('should call EmailsService.send with correct parameters', async () => {
      const mockData = {
        company: 'testCompany',
        subject: 'Test Subject',
        email: 'test@example.com',
        html: '<h1>Test</h1>',
        text: 'Test',
      };

      await controller.sendEmail(mockData);

      expect(mockEmailsService.send).toHaveBeenCalledWith(mockData);
    });
  });

  describe('sendEmails', () => {
    it('should call EmailsService.sendEmails with correct parameters', async () => {
      const mockData = {
        company: 'testCompany',
        subject: 'Test Subject',
        emails: [{ email: 'test1@example.com' }, { email: 'test2@example.com' }],
        html: '<h1>Test</h1>',
        text: 'Test',
      };

      await controller.sendEmails(mockData);

      expect(mockEmailsService.sendEmails).toHaveBeenCalledWith(mockData);
    });
  });
});
