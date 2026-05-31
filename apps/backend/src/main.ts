import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import compression = require('compression');
import { Response } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ApiResponseInterceptor } from './common/interceptors/api-response.interceptor';
import { HealthService } from './modules/health/health.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;
  const corsOrigin = configService.get<string>('CORS_ORIGIN') ?? 'http://localhost:5173';

  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: corsOrigin.split(',').map((origin) => origin.trim()),
    credentials: true,
  });
  app.use(helmet());
  app.use(compression());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ApiResponseInterceptor());

  const healthService = app.get(HealthService);
  app.getHttpAdapter().get('/health', (_request: unknown, response: Response) => {
    response.json({
      success: true,
      data: healthService.getHealth(),
      message: 'OK',
    });
  });

  await app.listen(port);
}

void bootstrap();
