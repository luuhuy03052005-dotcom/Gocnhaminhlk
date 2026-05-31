import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiErrorResponse } from '../interfaces/api-response.interface';

interface ErrorBody {
  message?: string | string[];
  error?: string;
  details?: unknown;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const body =
      exception instanceof HttpException ? exception.getResponse() : undefined;
    const errorBody = typeof body === 'object' && body !== null ? (body as ErrorBody) : {};
    const rawMessage =
      errorBody.message ??
      (typeof body === 'string' ? body : 'Internal server error');
    const message = Array.isArray(rawMessage) ? rawMessage.join(', ') : rawMessage;

    const payload: ApiErrorResponse = {
      success: false,
      error: {
        code: errorBody.error ?? this.statusToCode(status),
        message,
        details: errorBody.details,
      },
    };

    response.status(status).json(payload);
  }

  private statusToCode(status: number): string {
    if (status === HttpStatus.BAD_REQUEST) return 'VALIDATION_ERROR';
    if (status === HttpStatus.UNAUTHORIZED) return 'UNAUTHORIZED';
    if (status === HttpStatus.FORBIDDEN) return 'FORBIDDEN';
    if (status === HttpStatus.NOT_FOUND) return 'NOT_FOUND';
    return 'INTERNAL_SERVER_ERROR';
  }
}
