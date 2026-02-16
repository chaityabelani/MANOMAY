import connectDB from '@/lib/db';
import Shop from '@/models/Shop';
import Product from '@/models/Product';
import Link from 'next/link';
import ProductGrid from './ProductGrid';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default async function ShopPage(props: {
    params: Promise<{ shopId: string }>;
    searchParams: Promise<{ table?: string }>;
}) {
    // Await params in Next.js 15+
    const params = await props.params;
    const searchParams = await props.searchParams;

    console.log('🔍 [SHOP PAGE] Attempting to load shop:', params.shopId);

    try {
        console.log('🔌 [SHOP PAGE] Connecting to database...');
        await connectDB();
        console.log('✅ [SHOP PAGE] Database connected successfully');

        // Fetch session to check if user is logged in
        const session = await getSession();

        const tableNumber = searchParams.table || '1';

        console.log('🔎 [SHOP PAGE] Looking up shop in database with ID:', params.shopId);
        const shop = await Shop.findById(params.shopId).lean();

        console.log('🏪 [SHOP PAGE] Shop found:', shop ? `✅ ${shop.name}` : '❌ NOT FOUND');

        if (!shop) {
            console.error('❌ [SHOP PAGE] Shop not found, triggering notFound()');
            notFound();
        }

        console.log('📦 [SHOP PAGE] Fetching products for shop...');
        const products = await Product.find({
            shopId: params.shopId,
            isAvailable: true,
        })
            .sort({ createdAt: -1 })
            .lean();

        console.log(`✅ [SHOP PAGE] Found ${products.length} products`);

        return (
            <div className="min-h-screen bg-slate-50">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <Link
                                href={`/menu?table=${tableNumber}`}
                                className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-2"
                            >
                                <span>←</span> Back
                            </Link>

                            <div className="flex items-center gap-3">
                                {/* Show user profile if logged in */}
                                {session ? (
                                    <Link
                                        href={session.user.role === 'vendor' ? '/vendor/dashboard' : '/customer/dashboard'}
                                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition text-sm"
                                    >
                                        👤 {session.user.name}
                                    </Link>
                                ) : (
                                    <Link
                                        href="/customer/login"
                                        className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition text-sm"
                                    >
                                        Login
                                    </Link>
                                )}

                                <Link
                                    href="/cart"
                                    className="px-4 py-2 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition shadow-md flex items-center gap-2"
                                >
                                    🛒 <span className="hidden sm:inline">Cart</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="container mx-auto px-4 py-8">
                    {/* Shop Header */}
                    <div className="bg-white rounded-3xl p-8 mb-8 border border-slate-200 shadow-sm">
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">{shop.name}</h1>
                        <p className="text-slate-600">{shop.description || 'Welcome to our shop!'}</p>
                        <div className="mt-4 flex gap-2 flex-wrap">
                            {shop.cuisineType?.map((cuisine: string, index: number) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                                >
                                    {cuisine}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Products Grid */}
                    {products.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
                            <p className="text-slate-600 text-lg">No products available right now.</p>
                        </div>
                    ) : (
                        <ProductGrid
                            products={products.map((p: any) => ({
                                id: p._id.toString(),
                                shopId: shop._id.toString(),
                                shopName: shop.name,
                                name: p.name,
                                description: p.description,
                                price: p.price,
                                image: p.image || '',
                                isVeg: p.isVeg,
                                category: p.category,
                            }))}
                        />
                    )}
                </main>
            </div>
        );
    } catch (error: any) {
        console.error('❌ [SHOP PAGE] Critical error:', error);
        console.error('Stack trace:', error.stack);

        const errorMessage = error.message || 'Unknown error';
        const isDBError = errorMessage.includes('connect') || errorMessage.includes('ECONNREFUSED');

        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="text-center bg-white rounded-3xl p-8 border border-red-200 max-w-2xl">
                    <div className="text-6xl mb-4">{isDBError ? '🔌' : '😕'}</div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                        {isDBError ? 'Database Connection Error' : 'Unable to Load Shop'}
                    </h1>
                    <p className="text-slate-600 mb-4">
                        {isDBError
                            ? 'Cannot connect to the database. Please check your connection.'
                            : 'There was an error loading this shop.'}
                    </p>
                    <div className="bg-slate-100 rounded-lg p-4 mb-6 text-left">
                        <p className="text-xs font-mono text-red-600 break-all">
                            Error: {errorMessage}
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                            Shop ID: {params.shopId}
                        </p>
                    </div>
                    <div className="flex gap-3 justify-center">
                        <Link
                            href="/menu"
                            className="px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition"
                        >
                            ← Back to Menu
                        </Link>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition"
                        >
                            🔄 Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
