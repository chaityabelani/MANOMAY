import connectDB from '@/lib/db';
import Shop from '@/models/Shop';
import Product from '@/models/Product';
import Link from 'next/link';
import ProductGrid from './ProductGrid';
import { notFound } from 'next/navigation';

export default async function ShopPage({
    params,
    searchParams,
}: {
    params: { shopId: string };
    searchParams: { table?: string };
}) {
    try {
        await connectDB();

        const tableNumber = searchParams.table || '1';
        const shop = await Shop.findById(params.shopId).lean();

        if (!shop) {
            notFound();
        }

        const products = await Product.find({
            shopId: params.shopId,
            isAvailable: true,
        })
            .sort({ createdAt: -1 })
            .lean();

        return (
            <div className="min-h-screen bg-slate-50">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <Link
                                href={`/menu?table=${tableNumber}`}
                                className="text-slate-600 hover:text-slate-900 font-medium"
                            >
                                ← Back to Shops
                            </Link>
                            <Link
                                href="/cart"
                                className="px-4 py-2 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition"
                            >
                                🛒 Cart
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="container mx-auto px-4 py-8">
                    {/* Shop Header */}
                    <div className="bg-white rounded-3xl p-8 mb-8 border border-slate-200">
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
    } catch (error) {
        console.error('Shop page error:', error);
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="text-center bg-white rounded-3xl p-8 border border-slate-200 max-w-md">
                    <div className="text-6xl mb-4">😕</div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                        Unable to Load Shop
                    </h1>
                    <p className="text-slate-600 mb-6">
                        There was an error loading this shop. Please try again or contact support.
                    </p>
                    <Link
                        href="/menu"
                        className="inline-block px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition"
                    >
                        ← Back to Menu
                    </Link>
                </div>
            </div>
        );
    }
}
