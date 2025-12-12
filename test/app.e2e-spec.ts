import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/core/prisma/prisma.service';

// Mock environment variables
process.env.SENDGRID_API_KEY = 'SG.mocked-api-key';
process.env.DATABASE_URL = 'file:./test.db';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = app.get(PrismaService);

    // Enable shutdown hooks for e2e tests
    prismaService.enableShutdownHooks(app);

    await app.init();

    // Clean up database before each test
    await prismaService.company.deleteMany();
  });

  afterEach(async () => {
    // Clean up after each test
    await prismaService.company.deleteMany();
  });

  afterAll(async () => {
    // Close database connection
    await prismaService.$disconnect();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
