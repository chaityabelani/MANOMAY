import mongoose from 'mongoose';
import FoodPark from './src/models/FoodPark.ts';
import Shop from './src/models/Shop.ts';
import Product from './src/models/Product.ts';
import User from './src/models/User.ts';
import TableSession from './src/models/TableSession.ts';
import Order from './src/models/Order.ts';

console.log('Verifying Models...');

try {
    const park = new FoodPark({ name: 'Test Park' });
    console.log('✅ FoodPark model loaded');

    const shop = new Shop({ name: 'Test Shop' });
    console.log('✅ Shop model loaded');

    const product = new Product({ name: 'Test Product' });
    console.log('✅ Product model loaded');

    const user = new User({ name: 'Test User' });
    console.log('✅ User model loaded');

    const session = new TableSession({ tableNumber: 'T1' });
    console.log('✅ TableSession model loaded');

    const order = new Order({ totalAmount: 100 });
    console.log('✅ Order model loaded');

    console.log('🎉 All models verified successfully!');
    process.exit(0);
} catch (error) {
    console.error('❌ Model verification failed:', error);
    process.exit(1);
}
