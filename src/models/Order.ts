import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
    productId: mongoose.Types.ObjectId;
    shopId: mongoose.Types.ObjectId; // CRITICAL: for splitting orders to vendors
    name: string;
    price: number;
    quantity: number;
    customizations?: Record<string, any>;
}

export interface IOrder extends Document {
    parkId?: mongoose.Types.ObjectId;
    tableNumber?: string;
    userId?: mongoose.Types.ObjectId;
    items: IOrderItem[];
    totalAmount: number;
    status: 'placed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'failed';
    paymentId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    shopId: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
        required: true, // MUST have shopId to split orders
    },
    name: String,
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    customizations: { type: Schema.Types.Mixed },
});

const OrderSchema: Schema<IOrder> = new Schema(
    {
        parkId: {
            type: Schema.Types.ObjectId,
            ref: 'FoodPark',
        },
        tableNumber: {
            type: String,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        items: [OrderItemSchema],
        totalAmount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['placed', 'preparing', 'ready', 'delivered', 'cancelled'],
            default: 'placed',
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },
        paymentId: String,
    },
    {
        timestamps: true,
    }
);

const Order: Model<IOrder> =
    mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
