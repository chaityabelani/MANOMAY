const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function checkShopIds() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
        const Shop = mongoose.model('Shop', new mongoose.Schema({}, { strict: false }));

        const products = await Product.find({}).limit(10);
        const shops = await Shop.find({});

        console.log(`\n📦 Total Products: ${await Product.countDocuments()}`);
        console.log(`🏪 Total Shops: ${await Shop.countDocuments()}\n`);

        console.log('🔍 Sample Products with their shopIds:');
        for (const product of products) {
            const shopExists = shops.find(s => s._id.toString() === product.shopId?.toString());
            console.log(`  - ${product.name}`);
            console.log(`    shopId: ${product.shopId || 'MISSING!'}`);
            console.log(`    Shop exists: ${shopExists ? `✅ ${shopExists.name}` : '❌ NOT FOUND'}\n`);
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkShopIds();
