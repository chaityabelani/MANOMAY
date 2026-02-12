import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFoodPark extends Document {
    name: string;
    location: string;
    adminId: mongoose.Types.ObjectId;
    isActive: boolean;
    tables: {
        number: string;
        qrCode: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const FoodParkSchema: Schema<IFoodPark> = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Food park name is required'],
            trim: true,
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
        },
        adminId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        tables: [
            {
                number: {
                    type: String,
                    required: true,
                },
                qrCode: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const FoodPark: Model<IFoodPark> =
    mongoose.models.FoodPark || mongoose.model<IFoodPark>('FoodPark', FoodParkSchema);

export default FoodPark;
