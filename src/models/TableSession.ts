import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITableSession extends Document {
    parkId: mongoose.Types.ObjectId;
    tableNumber: string;
    qrCodeString: string;
    activeOrderId?: mongoose.Types.ObjectId; // Reference to the current active Order
    createdAt: Date;
    updatedAt: Date;
}

const TableSessionSchema: Schema<ITableSession> = new Schema(
    {
        parkId: {
            type: Schema.Types.ObjectId,
            ref: 'FoodPark',
            required: true,
            index: true,
        },
        tableNumber: {
            type: String,
            required: true,
        },
        qrCodeString: {
            type: String,
            required: true,
            unique: true,
        },
        activeOrderId: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
        },
    },
    {
        timestamps: true,
    }
);

// Prevent overwrite of model if already compiled
const TableSession: Model<ITableSession> =
    mongoose.models.TableSession || mongoose.model<ITableSession>('TableSession', TableSessionSchema);

export default TableSession;
