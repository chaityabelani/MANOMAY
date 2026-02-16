import Link from 'next/link';

export default function ShopNotFound() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="text-center bg-white rounded-3xl p-8 border border-slate-200 max-w-md">
                <div className="text-6xl mb-4">🏪</div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                    Shop Not Found
                </h1>
                <p className="text-slate-600 mb-6">
                    This shop doesn't exist or has been removed.
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
