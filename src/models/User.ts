import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string; // Optional because we might select: false
    role: 'admin' | 'staff' | 'user' | 'vendor' | 'superadmin';
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            maxlength: [60, 'Name cannot be more than 60 characters'],
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please email a valid email address',
            ],
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // 🛡️ CRITICAL: Never return password by default
        },
        role: {
            type: String,
            enum: ['admin', 'staff', 'user', 'vendor', 'superadmin'],
            default: 'user',
        },
    },
    {
        timestamps: true,
    }
);

// Prevent overwrite of model if already compiled
const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
