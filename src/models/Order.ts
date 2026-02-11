import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
    productId: mongoose.Types.ObjectId;
    shopId: mongoose.Types.ObjectId;
    name: string;
    quantity: number;
    price: number;
    options?: Map<string, any>;
}

export interface IOrder extends Document {
    parkId: mongoose.Types.ObjectId;
    tableSessionId: mongoose.Types.ObjectId;
    tableNumber: string;
    userId?: mongoose.Types.ObjectId; // Optional: specific user if logged in
    status: 'placed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
    items: IOrderItem[];
    totalAmount: number;
    paymentStatus: 'pending' | 'paid' | 'failed';
    paymentId?: string; // Stripe Payment Intent ID
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
        required: true,
    },
    name: String,
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    options: { type: Map, of: Schema.Types.Mixed },
});

const OrderSchema: Schema<IOrder> = new Schema(
    {
        parkId: {
            type: Schema.Types.ObjectId,
            ref: 'FoodPark',
            required: true,
            index: true,
        },
        tableSessionId: {
            type: Schema.Types.ObjectId,
            ref: 'TableSession',
            required: true,
        },
        tableNumber: {
            type: String,
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        status: {
            type: String,
            enum: ['placed', 'preparing', 'ready', 'delivered', 'cancelled'],
            default: 'placed',
        },
        items: [OrderItemSchema],
        totalAmount: {
            type: Number,
            required: true,
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

// Prevent overwrite of model if already compiled
const Order: Model<IOrder> =
    mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
