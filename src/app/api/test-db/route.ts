import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET() {
    try {
        await dbConnect();

        // Optional: Fetch count of products to verify model interaction
        // const count = await Product.countDocuments({});

        return NextResponse.json({
            success: true,
            message: 'Database Connected Successfully',
            // count 
        }, { status: 200 });
    } catch (error) {
        console.error('Database Connection Error:', error);
        return NextResponse.json({
            success: false,
            message: 'Database Connection Failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
