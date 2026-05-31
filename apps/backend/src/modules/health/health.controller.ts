import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getHealth() {
    return this.healthService.getHealth();
  }

  @Get('db')
  getDatabaseHealth() {
    return this.healthService.getDatabaseHealth();
  }

  @Get('storage')
  getStorageHealth() {
    return this.healthService.getStorageHealth();
  }

  @Get('auth')
  getAuthHealth() {
    return this.healthService.getAuthHealth();
  }
}
