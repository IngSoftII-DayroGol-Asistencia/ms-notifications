import { HttpException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { Company, Prisma } from '@prisma/client';

@Injectable()
export class CompaniesService {
  private logger: Logger;
  constructor(private prisma: PrismaService) {
    this.logger = new Logger(CompaniesService.name);
  }

  async findOne(
    userWhereUniqueInput: Prisma.CompanyWhereUniqueInput,
  ): Promise<Company> {
    try {
      return await this.prisma.company.findUnique({
        where: userWhereUniqueInput,
      });
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Error Database Company', 400);
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CompanyWhereUniqueInput;
    where?: Prisma.CompanyWhereInput;
    orderBy?: Prisma.CompanyOrderByWithRelationInput;
  }): Promise<Company[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.company.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }
}
