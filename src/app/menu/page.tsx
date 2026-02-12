import { Suspense } from 'react';
import connectDB from '@/lib/db';
import Shop from '@/models/Shop';
import Product from '@/models/Product';
import Link from 'next/link';
import Image from 'next/image';

export default async function MenuPage({
    searchParams,
}: {
    searchParams: { table?: string };
}) {
    await connectDB();

    const tableNumber = searchParams.table || '1';

    // Fetch all active shops (in a real app, filter by parkId)
    const shops = await Shop.find({ isActive: true }).limit(20).lean();

    // Get sample products for each shop
    const shopIds = shops.map(s => s._id);
    const products = await Product.find({
        shopId: { $in: shopIds },
        isAvailable: true
    }).limit(100).lean();

    // Group products by shop
    const productsByShop = products.reduce((acc: any, product: any) => {
        const shopId = product.shopId.toString();
        if (!acc[shopId]) acc[shopId] = [];
        acc[shopId].push(product);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Manomay Food Court</h1>
                            <p className="text-sm text-slate-600">Table #{tableNumber}</p>
                        </div>
                        <Link
                            href="/cart"
                            className="relative px-4 py-2 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition"
                        >
                            🛒 Cart
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-3xl p-8 mb-8">
                    <h2 className="text-3xl font-bold mb-2">
                        Welcome! 👋
                    </h2>
                    <p className="text-orange-100">
                        Order from multiple shops in one cart. Food delivered to your table!
                    </p>
                </div>

                {/* Shops Grid */}
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Browse Shops</h3>

                {shops.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-slate-600">No shops available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {shops.map((shop: any) => {
                            const shopProducts = productsByShop[shop._id.toString()] || [];
                            const sampleProduct = shopProducts[0];

                            return (
                                <Link
                                    key={shop._id.toString()}
                                    href={`/shop/${shop._id.toString()}?table=${tableNumber}`}
                                    className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl transition group"
                                >
                                    {/* Shop Image/Banner */}
                                    <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-200">
                                        {sampleProduct?.image && (
                                            <Image
                                                src={sampleProduct.image}
                                                alt={shop.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition"></div>
                                    </div>

                                    {/* Shop Info */}
                                    <div className="p-5">
                                        <h4 className="text-xl font-bold text-slate-900 mb-2">
                                            {shop.name}
                                        </h4>
                                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                                            {shop.description || 'Delicious food awaits!'}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-500">
                                                {shopProducts.length} items
                                            </span>
                                            <span className="text-orange-600 font-bold group-hover:translate-x-1 transition-transform inline-block">
                                                Browse →
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
