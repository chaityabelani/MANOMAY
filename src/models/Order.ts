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
    shopId: mongoose.Types.ObjectId; // Each order belongs to ONE shop
    tableNumber: string;
    userId?: mongoose.Types.ObjectId;
    customerName: string;
    customerPhone: string;
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
        shopId: {
            type: Schema.Types.ObjectId,
            ref: 'Shop',
            required: true,
            index: true,
        },
        tableNumber: {
            type: String,
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        customerName: {
            type: String,
            required: true,
        },
        customerPhone: {
            type: String,
            required: true,
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

// Add indexes for better query performance
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ 'items.shopId': 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ createdAt: -1 });

const Order: Model<IOrder> =
    mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
