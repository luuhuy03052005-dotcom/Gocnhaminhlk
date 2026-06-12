import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class MongoIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException({
        error: 'INVALID_MONGO_ID',
        message: 'Invalid MongoDB object id.',
        details: {
          value,
        },
      });
    }

    return value;
  }
}
