import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { TransformInterceptor } from './transform.interceptor';

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<any>;

  beforeEach(() => {
    interceptor = new TransformInterceptor();
  });

  it('should be defined', () => {
    expect(new TransformInterceptor()).toBeDefined();
  });

  it('should transform the response correctly', (done) => {
    const mockContext = {
      getArgByIndex: jest.fn((index: number) => {
        if (index === 0) {
          return {
            originalUrl: '/test',
            route: { stack: [{ method: 'GET' }] },
            hostname: 'localhost',
          };
        }
        if (index === 1) {
          return { statusCode: 200 };
        }
      }),
    } as unknown as ExecutionContext;

    const mockHandler: CallHandler = {
      handle: jest.fn(() => of({ data: 'test data' })),
    };

    interceptor.intercept(mockContext, mockHandler).subscribe((result) => {
      expect(result).toEqual({
        infoService: {
          appName: process.env.APP_NAME,
          timeStamp: expect.any(String),
          path: '/test',
          method: 'GET',
          host: 'localhost',
        },
        status: {
          statusCode: 200,
          message: 'Sucessfull',
        },
        responsePayload: { result: true, data: { data: 'test data' } },
      });
      done();
    });
  });
});
