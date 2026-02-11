
import mongoose from 'mongoose';
import FoodPark from '../src/models/FoodPark.ts';
import User from '../src/models/User.ts';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env.local');
    process.exit(1);
}

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI as string);
        console.log('✅ Connected to MongoDB');

        // 1. Create Default Food Park
        const existingPark = await FoodPark.findOne({ name: 'Manomay Food Park' });
        if (existingPark) {
            console.log('ℹ️ Manomay Food Park already exists.');
        } else {
            // Need an admin ID. Let's find the first user or create a dummy one.
            let admin = await User.findOne({ role: 'superadmin' });
            if (!admin) {
                admin = await User.findOne();
                if (admin) {
                    console.log(`ℹ️ Using existing user ${admin.name} as Park Admin.`);
                } else {
                    console.log('⚠️ No users found. Please sign up first or run this after creating a user.');
                    // Optionally create a superadmin here, but better to let user sign up.
                    // For now, we can't create a park without an admin.
                    // Let's create a placeholder ObjectId if needed, or just fail.
                    // Actually, we can create a seed admin.
                }
            }

            if (admin) {
                const newPark = await FoodPark.create({
                    name: 'Manomay Food Park',
                    location: {
                        lat: 12.9716,
                        lng: 77.5946,
                        address: 'Bangalore, India'
                    },
                    adminId: admin._id,
                    isActive: true
                });
                console.log('✅ Created Manomay Food Park:', newPark._id);
            } else {
                console.log('❌ Cannot create Park without a User. Sign up in the app first!');
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
}

seed();
