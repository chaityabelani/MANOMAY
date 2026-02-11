import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFoodPark extends Document {
    name: string;
    location: {
        lat: number;
        lng: number;
        address?: string;
    };
    adminId: mongoose.Types.ObjectId; // Reference to the Super Admin User
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const FoodParkSchema: Schema<IFoodPark> = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name for the Food Park'],
            unique: true,
        },
        location: {
            lat: Number,
            lng: Number,
            address: String,
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
    },
    {
        timestamps: true,
    }
);

// Prevent overwrite of model if already compiled
const FoodPark: Model<IFoodPark> =
    mongoose.models.FoodPark || mongoose.model<IFoodPark>('FoodPark', FoodParkSchema);

export default FoodPark;
