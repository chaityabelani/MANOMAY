const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function testConnection() {
    const envPath = path.join(__dirname, '.env.local');
    let uri = '';

    try {
        const envContent = fs.readFileSync(envPath, 'utf8');
        // Regex to find MONGODB_URI, handling quotes and comments
        const match = envContent.match(/^MONGODB_URI=(.*)$/m);
        if (match && match[1]) {
            uri = match[1].trim();
        }
    } catch (err) {
        console.error('❌ Could not read .env.local:', err.message);
        process.exit(1);
    }

    if (!uri) {
        console.error('❌ MONGODB_URI not found in .env.local');
        process.exit(1);
    }

    // Remove quotes if present
    if ((uri.startsWith('"') && uri.endsWith('"')) || (uri.startsWith("'") && uri.endsWith("'"))) {
        uri = uri.slice(1, -1);
    }

    if (uri.includes('<PASSWORD>')) {
        console.error('❌ ERROR: You have not replaced <PASSWORD> in .env.local with your actual password.');
        process.exit(1);
    }

    console.log('Attempting connection...');
    // Mask password for logging
    console.log('URI:', uri.replace(/:([^:@]+)@/, ':****@'));

    try {
        await mongoose.connect(uri);
        console.log('✅ DATABASE CONNECTED SUCCESSFULLY!');
        console.log('   The connection string and network access are correct.');
        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ CONNECTION FAILED:', error.message);
        console.error('   Common causes:');
        console.error('   1. IP not whitelisted in Atlas (Network Access)');
        console.error('   2. Wrong password');
        console.error('   3. Wrong database name');
        process.exit(1);
    }
}

testConnection();
