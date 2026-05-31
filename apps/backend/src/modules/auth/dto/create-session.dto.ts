import { IsIn, IsString, MinLength } from 'class-validator';

export const clientTypes = ['WEB_CUSTOMER', 'ADMIN_APP'] as const;
export type ClientType = (typeof clientTypes)[number];

export class CreateSessionDto {
  @IsString()
  @MinLength(10)
  firebaseIdToken: string;

  @IsIn(clientTypes)
  clientType: ClientType;
}

