import { HttpException, ArgumentsHost } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
  });

  it('should be defined', () => {
    expect(new HttpExceptionFilter()).toBeDefined();
  });

  it('should format the exception response correctly', () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockRequest = {
      url: '/test',
      method: 'GET',
    };
    const mockHost = {
      switchToHttp: jest.fn(() => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      })),
    } as unknown as ArgumentsHost;

    const exception = new HttpException('Test error', 400);

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      infoService: {
        appname: process.env.APP_NAME,
        timestamp: expect.any(String),
        path: '/test',
        method: 'GET',
      },
      status: {
        statusCode: 400,
        message: 'Test error',
      },
      responsePayload: {
        result: false,
        data: false,
      },
    });
  });
});
