import { IsIn, IsString } from 'class-validator';
import {
  AllowedUploadFolder,
  allowedUploadFolders,
} from '../../upload/upload.service';

export class AdminUploadDto {
  @IsString()
  @IsIn([...allowedUploadFolders])
  folder: AllowedUploadFolder;
}
