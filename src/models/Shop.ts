import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IShop extends Document {
    parkId: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    cuisineType: string[];
    ownerId: mongoose.Types.ObjectId; // Reference to the Vendor User
    image?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ShopSchema: Schema<IShop> = new Schema(
    {
        parkId: {
            type: Schema.Types.ObjectId,
            ref: 'FoodPark',
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Please provide a shop name'],
        },
        description: String,
        cuisineType: {
            type: [String],
            default: [],
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        image: String,
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
const Shop: Model<IShop> =
    mongoose.models.Shop || mongoose.model<IShop>('Shop', ShopSchema);

export default Shop;
