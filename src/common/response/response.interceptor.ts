import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        const message = response?.message || 'Request successful';
        const data = response?.data !== undefined ? response.data : response;

        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message,
          data,
        };
      }),
    );
  }
}
