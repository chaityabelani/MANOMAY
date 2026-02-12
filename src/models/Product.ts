import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
    shopId: mongoose.Types.ObjectId;
    name: string;
    description: string;
    price: number;
    category: string;
    image?: string;
    isVeg: boolean;
    isAvailable: boolean;
    embedding?: number[]; // For AI-powered search (future feature)
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
    {
        shopId: {
            type: Schema.Types.ObjectId,
            ref: 'Shop',
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: 0,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
        },
        image: {
            type: String,
        },
        isVeg: {
            type: Boolean,
            default: false,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        embedding: {
            type: [Number],
            select: false, // Don't include in queries by default
        },
    },
    {
        timestamps: true,
    }
);

const Product: Model<IProduct> =
    mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
