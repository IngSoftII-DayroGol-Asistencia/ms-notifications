import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import { PrismaService } from '../core/prisma/prisma.service';

describe('CompaniesService', () => {
  let service: CompaniesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompaniesService, PrismaService],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a company if found', async () => {
      const mockCompany = { id: 1, name: 'Test Company' };
      const mockPrismaService = {
        company: { findUnique: jest.fn().mockResolvedValue(mockCompany) },
      };
      const service = new CompaniesService(mockPrismaService as any);

      const result = await service.findOne({ id: 1 });
      expect(result).toEqual(mockCompany);
      expect(mockPrismaService.company.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw an HttpException if an error occurs', async () => {
      const mockPrismaService = {
        company: { findUnique: jest.fn().mockRejectedValue(new Error('Database error')) },
      };
      const service = new CompaniesService(mockPrismaService as any);

      await expect(service.findOne({ id: 1 })).rejects.toThrow('Error Database Company');
    });
  });

  describe('findAll', () => {
    it('should return a list of companies', async () => {
      const mockCompanies = [
        { id: 1, name: 'Company A' },
        { id: 2, name: 'Company B' },
      ];
      const mockPrismaService = {
        company: { findMany: jest.fn().mockResolvedValue(mockCompanies) },
      };
      const service = new CompaniesService(mockPrismaService as any);

      const result = await service.findAll({});
      expect(result).toEqual(mockCompanies);
      expect(mockPrismaService.company.findMany).toHaveBeenCalledWith({
        skip: undefined,
        take: undefined,
        cursor: undefined,
        where: undefined,
        orderBy: undefined,
      });
    });
  });
});