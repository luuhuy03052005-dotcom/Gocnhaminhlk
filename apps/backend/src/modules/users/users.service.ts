import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  findByFirebaseUid(firebaseUid: string) {
    return this.userModel.findOne({ firebaseUid, status: 'ACTIVE' }).exec();
  }

  findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  createCustomer(input: {
    firebaseUid: string;
    phoneNumber: string;
    fullName?: string;
    avatarUrl?: string;
  }) {
    return this.userModel.create({
      firebaseUid: input.firebaseUid,
      phoneNumber: input.phoneNumber,
      fullName: input.fullName,
      avatarUrl: input.avatarUrl,
      status: 'ACTIVE',
    });
  }
}
