import mongoose, { Schema, Document } from 'mongoose';

export interface ITableSession extends Document {
    parkId: mongoose.Types.ObjectId;
    tableNumber: string;
    sessionId: string; // Unique session identifier
    isActive: boolean;
    createdAt: Date;
    expiresAt: Date;
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
        sessionId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Auto-delete expired sessions
TableSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const TableSession = mongoose.models.TableSession || mongoose.model<ITableSession>('TableSession', TableSessionSchema);

export default TableSession;
