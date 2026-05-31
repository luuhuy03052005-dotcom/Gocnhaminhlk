import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { App, cert, getApps, initializeApp } from 'firebase-admin/app';
import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import { AdminsService } from '../admins/admins.service';
import { RolesService } from '../roles/roles.service';
import { UsersService } from '../users/users.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { AuthSessionResponse } from './interfaces/auth-session-response.interface';

@Injectable()
export class AuthService {
  private firebaseApp?: App;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly adminsService: AdminsService,
    private readonly rolesService: RolesService,
  ) {}

  async createSession(dto: CreateSessionDto): Promise<AuthSessionResponse> {
    const decodedToken = await this.verifyFirebaseIdToken(dto.firebaseIdToken);

    if (dto.clientType === 'WEB_CUSTOMER') {
      return this.resolveCustomerSession(decodedToken);
    }

    return this.resolveAdminSession(decodedToken);
  }

  async getMe(authorization?: string): Promise<AuthSessionResponse> {
    const firebaseIdToken = this.extractBearerToken(authorization);
    const decodedToken = await this.verifyFirebaseIdToken(firebaseIdToken);
    const user = await this.usersService.findByFirebaseUid(decodedToken.uid);

    if (user) {
      return {
        id: user.id,
        firebaseUid: user.firebaseUid,
        phoneNumber: user.phoneNumber,
        fullName: user.fullName ?? '',
        role: 'CUSTOMER',
      };
    }

    return this.resolveAdminSession(decodedToken);
  }

  private async resolveCustomerSession(decodedToken: DecodedIdToken): Promise<AuthSessionResponse> {
    const existingUser = await this.usersService.findByFirebaseUid(decodedToken.uid);
    const user =
      existingUser ??
      (await this.usersService.createCustomer({
        firebaseUid: decodedToken.uid,
        phoneNumber: this.getPhoneNumber(decodedToken),
        fullName: decodedToken.name,
        avatarUrl: decodedToken.picture,
      }));

    return {
      id: user.id,
      firebaseUid: user.firebaseUid,
      phoneNumber: user.phoneNumber,
      fullName: user.fullName ?? '',
      role: 'CUSTOMER',
    };
  }

  private async resolveAdminSession(decodedToken: DecodedIdToken): Promise<AuthSessionResponse> {
    const admin = await this.adminsService.findByFirebaseUid(decodedToken.uid);
    if (!admin) {
      throw new NotFoundException({
        error: 'ADMIN_NOT_FOUND',
        message: 'Admin account is not registered or active.',
      });
    }

    const role = await this.rolesService.getRoleWithPermissions(admin.roleId.toString());
    if (!role) {
      throw new ForbiddenException({
        error: 'ADMIN_ROLE_INACTIVE',
        message: 'Admin role is inactive or missing.',
      });
    }

    return {
      id: admin.id,
      firebaseUid: admin.firebaseUid,
      phoneNumber: admin.phoneNumber,
      fullName: admin.fullName,
      role: role.code,
    };
  }

  private getPhoneNumber(decodedToken: DecodedIdToken): string {
    if (decodedToken.phone_number) {
      return decodedToken.phone_number;
    }

    throw new UnauthorizedException({
      error: 'PHONE_NUMBER_REQUIRED',
      message: 'Firebase token must include phone_number.',
    });
  }

  private extractBearerToken(authorization?: string): string {
    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException({
        error: 'UNAUTHORIZED',
        message: 'Authorization bearer token is required.',
      });
    }

    const token = authorization.slice('Bearer '.length).trim();
    if (!token) {
      throw new UnauthorizedException({
        error: 'UNAUTHORIZED',
        message: 'Authorization bearer token is required.',
      });
    }

    return token;
  }

  private async verifyFirebaseIdToken(firebaseIdToken: string): Promise<DecodedIdToken> {
    const app = this.getFirebaseApp();

    try {
      return await getAuth(app).verifyIdToken(firebaseIdToken);
    } catch {
      throw new UnauthorizedException({
        error: 'UNAUTHORIZED',
        message: 'Firebase ID token is invalid or expired.',
      });
    }
  }

  private getFirebaseApp(): App {
    if (this.firebaseApp) {
      return this.firebaseApp;
    }

    const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
    const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');
    const privateKey = this.configService
      .get<string>('FIREBASE_PRIVATE_KEY')
      ?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      throw new ServiceUnavailableException({
        error: 'AUTH_PROVIDER_NOT_CONFIGURED',
        message: 'Firebase Admin environment variables are not fully configured.',
        details: {
          missing: [
            !projectId ? 'FIREBASE_PROJECT_ID' : null,
            !clientEmail ? 'FIREBASE_CLIENT_EMAIL' : null,
            !privateKey ? 'FIREBASE_PRIVATE_KEY' : null,
          ].filter(Boolean),
        },
      });
    }

    this.firebaseApp =
      getApps()[0] ??
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });

    return this.firebaseApp;
  }
}
