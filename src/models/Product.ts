import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
    shopId: mongoose.Types.ObjectId;
    name: string;
    description: string;
    price: number;
    category: string; // e.g., 'Starter', 'Main Course', 'Dessert'
    image?: string;
    isVeg?: boolean; // Vegetarian indicator
    embedding?: number[]; // Vector embedding for AI search
    isAvailable: boolean;
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
            required: [true, 'Please provide a name for this product.'],
            maxlength: [60, 'Name cannot be more than 60 characters'],
        },
        description: {
            type: String,
            required: [true, 'Please provide a description for this product.'],
        },
        price: {
            type: Number,
            required: [true, 'Please provide a price for this product.'],
        },
        category: {
            type: String,
            required: [true, 'Please specify the category.'],
        },
        image: {
            type: String,
        },
        isVeg: {
            type: Boolean,
            default: false, // Default to non-veg if not specified
        },
        embedding: {
            type: [Number], // For vector search
            select: false, // Hide by default to save bandwidth
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent overwrite of model if already compiled
const Product: Model<IProduct> =
    mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
