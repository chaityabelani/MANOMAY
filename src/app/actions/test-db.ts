'use server';

import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function testDatabaseConnection() {
    try {
        console.log('🔌 Attempting to connect to database...');
        await dbConnect();
        console.log('✅ Database connected successfully in Server Action');

        // Example of DB operation
        const count = await Product.countDocuments();

        return {
            success: true,
            message: `Successfully connected to MongoDB! Found ${count} products.`,
        };
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        return {
            success: false,
            message: 'Failed to connect to database',
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
