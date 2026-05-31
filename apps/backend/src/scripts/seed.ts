import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { FeatureFlagsService } from '../modules/feature-flags/feature-flags.service';
import { RolesService } from '../modules/roles/roles.service';
import { SystemSettingsService } from '../modules/system-settings/system-settings.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const rolesService = app.get(RolesService);
    const featureFlagsService = app.get(FeatureFlagsService);
    const systemSettingsService = app.get(SystemSettingsService);

    await rolesService.ensureInitialRolePermissions();
    await featureFlagsService.ensureInitialFlags();
    await systemSettingsService.ensureInitialSettings();

    const [roles, permissions, featureFlags, systemSettings] = await Promise.all([
      rolesService.findAll(),
      rolesService.findAllPermissions(),
      featureFlagsService.findAll(),
      systemSettingsService.findAll(),
    ]);

    console.log(
      `Seed completed: roles=${roles.length}, permissions=${permissions.length}, featureFlags=${featureFlags.length}, systemSettings=${systemSettings.length}`,
    );
  } finally {
    await app.close();
  }
}

void bootstrap().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
