import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserStatus } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  findByFirebaseUid(firebaseUid: string) {
    return this.userModel.findOne({ firebaseUid, status: 'ACTIVE' }).exec();
  }

  findAnyByFirebaseUid(firebaseUid: string) {
    return this.userModel.findOne({ firebaseUid }).exec();
  }

  findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  findAll() {
    return this.userModel.find().sort({ createdAt: -1 }).exec();
  }

  countAll() {
    return this.userModel.countDocuments().exec();
  }

  countByStatus(status: UserStatus) {
    return this.userModel.countDocuments({ status }).exec();
  }

  findActiveUserIds() {
    return this.userModel.find({ status: 'ACTIVE' }).select({ _id: 1 }).exec();
  }

  updateStatus(id: string, status: UserStatus) {
    return this.userModel
      .findByIdAndUpdate(id, { $set: { status } }, { new: true })
      .exec();
  }

  updateProfile(
    id: string,
    input: {
      fullName?: string;
      avatarUrl?: string;
    },
  ) {
    return this.userModel
      .findByIdAndUpdate(id, { $set: this.compact(input) }, { new: true })
      .exec();
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

  private compact<T extends object>(value: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).filter(
        ([, item]) => item !== undefined,
      ),
    ) as Partial<T>;
  }
}
