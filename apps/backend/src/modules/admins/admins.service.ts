import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from './schemas/admin.schema';

@Injectable()
export class AdminsService {
  constructor(@InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>) {}

  findByFirebaseUid(firebaseUid: string) {
    return this.adminModel.findOne({ firebaseUid, status: 'ACTIVE' }).exec();
  }

  findById(id: string) {
    return this.adminModel.findById(id).exec();
  }
}

