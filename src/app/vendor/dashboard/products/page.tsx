import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getVendorProducts } from '@/app/actions/product';
import Link from 'next/link';
import ProductList from './ProductList';
import BackButton from '@/components/BackButton';

export const dynamic = 'force-dynamic';

export default async function VendorProductsPage() {
    const result = await getVendorProducts();

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto">
                <BackButton href="/vendor/dashboard" label="Back to Dashboard" />
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">
                            My Products
                        </h1>
                        <p className="text-slate-600">
                            Manage your menu items
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/vendor/dashboard/products/scan"
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-xl hover:shadow-xl transition"
                        >
                            📸 AI Scanner
                        </Link>
                        <Link
                            href="/vendor/dashboard/products/add"
                            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold rounded-xl hover:shadow-xl transition"
                        >
                            ➕ Add Product
                        </Link>
                    </div>
                </div>

                {/* Products */}
                {result.products.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">
                            No products yet
                        </h3>
                        <p className="text-slate-600 mb-6">
                            Start by scanning your menu or adding products manually
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Link
                                href="/vendor/dashboard/products/scan"
                                className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition"
                            >
                                📸 Scan Menu
                            </Link>
                            <Link
                                href="/vendor/dashboard/products/add"
                                className="px-6 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition"
                            >
                                ➕ Add Manually
                            </Link>
                        </div>
                    </div>
                ) : (
                    <ProductList products={result.products} />
                )}
            </div>
        </div>
    );
}
