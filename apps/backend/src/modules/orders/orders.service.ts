import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from './schemas/order.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  findAll() {
    return this.orderModel.find().sort({ createdAt: -1 }).exec();
  }

  findById(id: string) {
    return this.orderModel.findById(id).exec();
  }

  findByUserId(userId: string | Types.ObjectId) {
    return this.orderModel
      .find({ userId: this.toObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  findByIdForUser(id: string, userId: string | Types.ObjectId) {
    return this.orderModel
      .findOne({
        _id: id,
        userId: this.toObjectId(userId),
      })
      .exec();
  }

  countAll() {
    return this.orderModel.countDocuments().exec();
  }

  countByStatus(status: OrderStatus) {
    return this.orderModel.countDocuments({ status }).exec();
  }

  updateStatus(id: string, status: OrderStatus) {
    return this.orderModel
      .findByIdAndUpdate(id, { $set: { status } }, { new: true })
      .exec();
  }

  private toObjectId(value: string | Types.ObjectId): Types.ObjectId {
    return typeof value === 'string' ? new Types.ObjectId(value) : value;
  }
}
