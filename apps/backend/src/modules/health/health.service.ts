import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

export type HealthStatus = 'ok' | 'not_configured' | 'unavailable';

export interface DependencyHealth {
  status: HealthStatus;
  configured: boolean;
  message?: string;
}

@Injectable()
export class HealthService {
  constructor(
    private readonly configService: ConfigService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  getHealth() {
    return {
      status: 'ok',
      service: 'goc-nha-minh-api',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
    };
  }

  async getDatabaseHealth(): Promise<DependencyHealth> {
    const uri = this.configService.get<string>('MONGODB_URI');
    if (!uri) {
      return {
        status: 'not_configured',
        configured: false,
        message: 'MONGODB_URI is not configured',
      };
    }

    try {
      if (this.connection.readyState !== 1) {
        return {
          status: 'unavailable',
          configured: true,
          message: `MongoDB connection state is ${this.connection.readyState}`,
        };
      }

      await this.connection.db?.admin().ping();

      return {
        status: 'ok',
        configured: true,
      };
    } catch (error) {
      return {
        status: 'unavailable',
        configured: true,
        message: error instanceof Error ? error.message : 'MongoDB unavailable',
      };
    }
  }

  getStorageHealth(): DependencyHealth {
    const configured = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'].every(
      (key) => Boolean(this.configService.get<string>(key)),
    );

    return {
      status: configured ? 'ok' : 'not_configured',
      configured,
      message: configured ? undefined : 'Cloudinary environment variables are not fully configured',
    };
  }

  getAuthHealth(): DependencyHealth {
    const configured = ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'].every(
      (key) => Boolean(this.configService.get<string>(key)),
    );

    return {
      status: configured ? 'ok' : 'not_configured',
      configured,
      message: configured ? undefined : 'Firebase Admin environment variables are not fully configured',
    };
  }
}
