// scripts/seed-admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// Load environment variables manually to avoid dotenv dependency issues if not installed
const envPath = path.join(__dirname, '../.env.local');
let uri = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/^MONGODB_URI=(.*)$/m);
    if (match && match[1]) {
        uri = match[1].trim();
    }
} catch (err) {
    console.error('❌ Could not read .env.local');
    process.exit(1);
}

// Clean URI
if ((uri.startsWith('"') && uri.endsWith('"')) || (uri.startsWith("'") && uri.endsWith("'"))) {
    uri = uri.slice(1, -1);
}

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function seedAdmin() {
    if (!uri) {
        console.error('❌ MONGODB_URI not found');
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log('🔌 Connected to MongoDB');

        const email = 'admin@manomay.com';
        const password = 'admin123'; // Change this purely for initial seed
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            console.log('⚠️ Admin user already exists. Updating password...');
            existingUser.password = hashedPassword;
            existingUser.role = 'admin';
            await existingUser.save();
            console.log('✅ Admin password reset to: admin123');
        } else {
            await User.create({
                name: 'Admin User',
                email,
                password: hashedPassword,
                role: 'admin',
            });
            console.log('✅ Admin user created');
            console.log(`📧 Email: ${email}`);
            console.log(`🔑 Password: ${password}`);
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
}

seedAdmin();
