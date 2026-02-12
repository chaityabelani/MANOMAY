import { NextRequest, NextResponse } from 'next/server';
import { scanMenuImage } from '@/lib/gemini';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await getSession();
        if (!session || session.user.role !== 'vendor') {
            return NextResponse.json(
                { error: 'Unauthorized - vendors only' },
                { status: 401 }
            );
        }

        // Get image from form data
        const formData = await request.formData();
        const file = formData.get('image') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No image provided' },
                { status: 400 }
            );
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Please upload JPG, PNG, or WebP' },
                { status: 400 }
            );
        }

        // Convert to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Scan menu with Gemini AI
        const products = await scanMenuImage(buffer, file.type);

        return NextResponse.json({
            success: true,
            products,
            message: `Successfully extracted ${products.length} menu items`,
        });
    } catch (error: any) {
        console.error('Menu scan error:', error);
        return NextResponse.json(
            {
                error: error.message || 'Failed to scan menu. Please try again with a clearer image.',
                success: false
            },
            { status: 500 }
        );
    }
}
