import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import { AppModule } from '../app.module';

const validRoleCodes = ['STAFF', 'MANAGER', 'SUPER_ADMIN'] as const;
type AdminRoleCode = (typeof validRoleCodes)[number];

function requireEnv(configService: ConfigService, key: string, required = true): string {
  const value = configService.get<string>(key)?.trim();
  if (required && !value) {
    throw new Error(`${key} is required for admin bootstrap.`);
  }

  return value ?? '';
}

function resolveRoleCode(configService: ConfigService): AdminRoleCode {
  const roleCode = configService.get<string>('ADMIN_ROLE_CODE')?.trim() || 'SUPER_ADMIN';
  if (!validRoleCodes.includes(roleCode as AdminRoleCode)) {
    throw new Error(`ADMIN_ROLE_CODE must be one of: ${validRoleCodes.join(', ')}`);
  }

  return roleCode as AdminRoleCode;
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const configService = app.get(ConfigService);
    const connection = app.get<Connection>(getConnectionToken());

    const firebaseUid = requireEnv(configService, 'ADMIN_FIREBASE_UID');
    const phoneNumber = requireEnv(configService, 'ADMIN_PHONE_NUMBER', false);
    const email = requireEnv(configService, 'ADMIN_EMAIL', false);
    const fullName = requireEnv(configService, 'ADMIN_FULL_NAME');
    const roleCode = resolveRoleCode(configService);

    if (!phoneNumber && !email) {
      throw new Error('At least one of ADMIN_PHONE_NUMBER or ADMIN_EMAIL is required for admin bootstrap.');
    }

    const role = await connection
      .collection('roles')
      .findOne<{ _id: Types.ObjectId }>({ code: roleCode, isActive: true });

    if (!role) {
      throw new Error(`Role ${roleCode} not found. Run npm run seed first.`);
    }

    await connection.collection('admins').updateOne(
      { firebaseUid },
      {
        $set: {
          firebaseUid,
          phoneNumber: phoneNumber || null,
          email: email || null,
          fullName,
          roleId: role._id,
          status: 'ACTIVE',
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true },
    );

    console.log(`Admin bootstrap completed: phoneNumber=${phoneNumber || 'N/A'}, email=${email || 'N/A'}, role=${roleCode}`);
  } finally {
    await app.close();
  }
}

void bootstrap().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

