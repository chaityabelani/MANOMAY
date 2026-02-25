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
    role: { type: String, default: 'customer' },
    shopId: { type: mongoose.Schema.Types.ObjectId },
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
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            console.log('⚠️  Admin user already exists — updating role and password...');
            existingUser.password = hashedPassword;
            existingUser.role = 'super-admin';  // ✅ correct role
            await existingUser.save();
            console.log('✅ Admin updated successfully');
        } else {
            await User.create({
                name: 'Super Admin',
                email,
                password: hashedPassword,
                role: 'super-admin',  // ✅ correct role
            });
            console.log('✅ Super admin created');
        }

        console.log('');
        console.log('─────────────────────────────');
        console.log(`  URL:      /admin/login`);
        console.log(`  Email:    ${email}`);
        console.log(`  Password: ${password}`);
        console.log('─────────────────────────────');
        console.log('');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
}

seedAdmin();
