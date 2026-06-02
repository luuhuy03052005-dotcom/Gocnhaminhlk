import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;
export type OrderType = 'DINE_IN' | 'TAKE_AWAY' | 'DELIVERY';
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED';

@Schema({ _id: false })
export class OrderItem {
  @Prop({ required: true, type: Types.ObjectId, ref: 'MenuItem' })
  menuItemId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ trim: true })
  note?: string;
}

const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({
  collection: 'orders',
  timestamps: true,
})
export class Order {
  @Prop({ required: true, unique: true, trim: true })
  orderNumber: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: ['DINE_IN', 'TAKE_AWAY', 'DELIVERY'] })
  orderType: OrderType;

  @Prop({
    required: true,
    enum: [
      'PENDING',
      'CONFIRMED',
      'PREPARING',
      'READY',
      'COMPLETED',
      'CANCELLED',
      'REJECTED',
    ],
    default: 'PENDING',
    index: true,
  })
  status: OrderStatus;

  @Prop({ required: true, type: [OrderItemSchema], default: [] })
  items: OrderItem[];

  @Prop({ required: true, min: 0, default: 0 })
  subtotal: number;

  @Prop({ required: true, min: 0, default: 0 })
  discountAmount: number;

  @Prop({ required: true, min: 0, default: 0 })
  totalAmount: number;

  @Prop({ trim: true })
  note?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });
