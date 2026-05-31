import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ApiSuccessResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ApiResponseInterceptor<T>
  implements NestInterceptor<T, ApiSuccessResponse<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiSuccessResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        message: 'OK',
      })),
    );
  }
}
