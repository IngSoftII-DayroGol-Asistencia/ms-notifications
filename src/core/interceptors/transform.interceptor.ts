import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  responsePayload: { result: boolean; data: T };
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        infoService: {
          appName: process.env.APP_NAME,
          timeStamp: new Date().toISOString(),
          path: context.getArgByIndex(0).originalUrl,
          method: context.getArgByIndex(0).route.stack[0].method,
          host: context.getArgByIndex(0).hostname,
        },
        status: {
          statusCode: context.getArgByIndex(1).statusCode,
          message: 'Sucessfull',
        },
        responsePayload: { result: true, data },
      })),
    );
  }
}
