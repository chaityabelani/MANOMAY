import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: string; // e.g., 'Starter', 'Main Course', 'Dessert'
    image?: string;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
    {
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
