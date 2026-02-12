import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IShop extends Document {
    name: string;
    description?: string;
    parkId: mongoose.Types.ObjectId;
    ownerId: mongoose.Types.ObjectId;
    cuisineType: string[];
    logo?: string;
    image?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ShopSchema: Schema<IShop> = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Shop name is required'],
            trim: true,
        },
        description: {
            type: String,
        },
        parkId: {
            type: Schema.Types.ObjectId,
            ref: 'FoodPark',
            required: true,
            index: true,
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        cuisineType: {
            type: [String],
            default: [],
        },
        logo: {
            type: String,
        },
        image: {
            type: String,
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

const Shop: Model<IShop> =
    mongoose.models.Shop || mongoose.model<IShop>('Shop', ShopSchema);

export default Shop;
