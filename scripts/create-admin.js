/**
 * Run this script locally to create/reset the super-admin user directly in MongoDB.
 * Usage: node scripts/create-admin.js
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://chaityabelani29_db_user:chaitya%407407@manomay.ninzcoz.mongodb.net/manomay?retryWrites=true&w=majority&appName=Manomay';

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['super-admin', 'vendor', 'customer'], default: 'customer' },
        shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    },
    { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createAdmin() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected! DB:', mongoose.connection.name);

        const email = 'admin@manomay.com';
        const password = 'Manomay@2024';
        const hashed = await bcrypt.hash(password, 10);

        // Verify bcrypt works correctly
        const ok = await bcrypt.compare(password, hashed);
        console.log('🔐 bcrypt round-trip ok:', ok);

        const existing = await User.findOne({ email });

        if (existing) {
            console.log('👤 User found! Current role:', existing.role);
            existing.role = 'super-admin';
            existing.password = hashed;
            await existing.save();
            console.log('✅ Admin account UPDATED successfully!');
        } else {
            console.log('👤 No existing user. Creating new admin...');
            await User.create({ name: 'Super Admin', email, password: hashed, role: 'super-admin' });
            console.log('✅ Admin account CREATED successfully!');
        }

        console.log('\n🎉 Ready to login:');
        console.log('   Email   :', email);
        console.log('   Password:', password);
        console.log('   URL     : https://manomay.vercel.app/admin/login\n');

    } catch (err) {
        console.error('❌ ERROR:', err.message);
    } finally {
        await mongoose.connection.close();
        console.log('Disconnected.');
    }
}

createAdmin();
