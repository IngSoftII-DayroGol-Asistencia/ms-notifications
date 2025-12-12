import { Test, TestingModule } from '@nestjs/testing';
import { EmailsService } from './emails.service';
import { SendGridService } from 'apicreatelibs/send-grid/send-grid.service';
import { CompaniesService } from 'src/companies/companies.service';
import { SendEmailDto, SendEmailsDto, SendEmailsCCDto } from './dto';

describe('EmailsService', () => {
  let service: EmailsService;
  let mockSendGridService: Partial<SendGridService>;
  let mockCompaniesService: Partial<CompaniesService>;

  beforeEach(async () => {
    mockSendGridService = {
      sendMail: jest.fn(),
      sendEmailCC: jest.fn(),
    };

    mockCompaniesService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailsService,
        { provide: SendGridService, useValue: mockSendGridService },
        { provide: CompaniesService, useValue: mockCompaniesService },
      ],
    }).compile();

    service = module.get<EmailsService>(EmailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('send', () => {
    it('should call sendMail with correct parameters', async () => {
      const mockData: SendEmailDto = {
        company: 'testCompany',
        subject: 'Test Subject',
        email: 'test@example.com',
        html: '<h1>Test</h1>',
        text: 'Test',
      };
      const mockCompany = { id: 1, company: 'testCompany', email: 'company@example.com' };
      jest.spyOn(mockCompaniesService, 'findOne').mockResolvedValue(mockCompany);

      await service.send(mockData);

      expect(mockCompaniesService.findOne).toHaveBeenCalledWith({ company: 'testCompany' });
      expect(mockSendGridService.sendMail).toHaveBeenCalledWith({
        from: 'company@example.com',
        subject: 'Test Subject',
        to: 'test@example.com',
        html: '<h1>Test</h1>',
        text: 'Test',
      });
    });

    it('should throw an exception if validation0 fails', async () => {
      const mockData: SendEmailDto = {
        company: 'invalidCompany',
        subject: 'Test Subject',
        email: 'test@example.com',
        html: '<h1>Test</h1>',
        text: 'Test',
      };
      jest.spyOn(mockCompaniesService, 'findOne').mockResolvedValue(null);

      await expect(service.send(mockData)).rejects.toThrow('Error Data Email');
    });
  });

  describe('sendEmails', () => {
    it('should call sendMail for each email', async () => {
      const mockData: SendEmailsDto = {
        company: 'testCompany',
        subject: 'Test Subject',
        emails: [{ email: 'test1@example.com' }, { email: 'test2@example.com' }],
        html: '<h1>Test</h1>',
        text: 'Test',
      };
      const mockCompany = { id: 1, company: 'testCompany', email: 'company@example.com' };
      jest.spyOn(mockCompaniesService, 'findOne').mockResolvedValue(mockCompany);

      await service.sendEmails(mockData);

      expect(mockSendGridService.sendMail).toHaveBeenCalledTimes(2);
      expect(mockSendGridService.sendMail).toHaveBeenCalledWith({
        from: 'company@example.com',
        subject: 'Test Subject',
        to: 'test1@example.com',
        html: '<h1>Test</h1>',
        text: 'Test',
      });
      expect(mockSendGridService.sendMail).toHaveBeenCalledWith({
        from: 'company@example.com',
        subject: 'Test Subject',
        to: 'test2@example.com',
        html: '<h1>Test</h1>',
        text: 'Test',
      });
    });
  });

  describe('sendEmails', () => {
    it('should call sendMail for the email', async () => {
      const mockData: SendEmailsDto = {
        company: 'testCompany',
        subject: 'Test Subject',
        emails: [{ email: 'test1@example.com' }], // Updated to match the expected type
        html: '<h1>Test</h1>',
        text: 'Test',
      };
      const mockCompany = { id: 1, company: 'testCompany', email: 'company@example.com' };
      jest.spyOn(mockCompaniesService, 'findOne').mockResolvedValue(mockCompany);

      await service.sendEmails(mockData);

      expect(mockSendGridService.sendMail).toHaveBeenCalledTimes(1);
      expect(mockSendGridService.sendMail).toHaveBeenCalledWith({
        from: 'company@example.com',
        subject: 'Test Subject',
        to: 'test1@example.com',
        html: '<h1>Test</h1>',
        text: 'Test',
      });
    });

    it('should throw an exception if validation0 fails', async () => {
      const mockData: SendEmailsDto = {
        company: 'invalidCompany',
        subject: 'Test Subject',
        emails: [{ email: 'test@example.com' }],
        html: '<h1>Test</h1>',
        text: 'Test',
      };
      jest.spyOn(mockCompaniesService, 'findOne').mockResolvedValue(null);

      await expect(service.sendEmails(mockData)).rejects.toThrow('Error Data Email');
    });
  });

  describe('sendEmailCC', () => {
    it('should call sendEmailCC with correct parameters', async () => {
      const mockData: SendEmailsCCDto = {
        company: 'testCompany',
        subject: 'Test Subject',
        emails: [{ email: 'test1@example.com' }, { email: 'test2@example.com' }],
        html: '<h1>Test</h1>',
        text: 'Test',
      };
      const mockCompany = { id: 1, company: 'testCompany', email: 'company@example.com' };
      jest.spyOn(mockCompaniesService, 'findOne').mockResolvedValue(mockCompany);

      await service.sendEmailCC(mockData);

      expect(mockCompaniesService.findOne).toHaveBeenCalledWith({ company: 'testCompany' });
      expect(mockSendGridService.sendEmailCC).toHaveBeenCalledWith({
        to: ['test1@example.com', 'test2@example.com'],
        from: 'company@example.com',
        subject: 'Test Subject',
        text: 'Test',
        html: '<h1>Test</h1>',
      });
    });

    it('should throw an exception if validation0 fails', async () => {
      const mockData: SendEmailsCCDto = {
        company: 'invalidCompany',
        subject: 'Test Subject',
        emails: [{ email: 'test@example.com' }],
        html: '<h1>Test</h1>',
        text: 'Test',
      };
      jest.spyOn(mockCompaniesService, 'findOne').mockResolvedValue(null);

      await expect(service.sendEmailCC(mockData)).rejects.toThrow('Error Data Email');
    });
  });
});
