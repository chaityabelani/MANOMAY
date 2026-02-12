import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
            {/* Hero Section */}
            <div className="container mx-auto px-6 py-20">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Logo/Title */}
                    <div className="mb-8">
                        <h1 className="text-6xl md:text-7xl font-bold text-slate-900 mb-4">
                            🍽️ MANOMAY
                        </h1>
                        <p className="text-2xl text-orange-600 font-semibold mb-2">
                            Digital Food Court
                        </p>
                        <p className="text-lg text-slate-600">
                            Order from multiple vendors in one place
                        </p>
                    </div>

                    {/* Main CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <Link
                            href="/menu"
                            className="px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white text-xl font-bold rounded-2xl hover:shadow-2xl hover:scale-105 transition"
                        >
                            🛒 Browse Menu
                        </Link>
                        <Link
                            href="/vendor/login"
                            className="px-8 py-4 bg-white border-2 border-orange-600 text-orange-600 text-xl font-bold rounded-2xl hover:bg-orange-50 hover:shadow-xl transition"
                        >
                            👨‍🍳 Vendor Login
                        </Link>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-100">
                            <div className="text-5xl mb-4">📱</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                QR Code Ordering
                            </h3>
                            <p className="text-slate-600">
                                Scan table QR code and order instantly
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-100">
                            <div className="text-5xl mb-4">🏪</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                Multi-Vendor Cart
                            </h3>
                            <p className="text-slate-600">
                                Order from multiple shops in one checkout
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-100">
                            <div className="text-5xl mb-4">🤖</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                AI Menu Scanner
                            </h3>
                            <p className="text-slate-600">
                                Vendors can upload menu photos for instant setup
                            </p>
                        </div>
                    </div>

                    {/* How It Works */}
                    <div className="mt-20">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8">
                            How It Works
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    1
                                </div>
                                <h4 className="font-bold text-slate-900 mb-2">Scan QR Code</h4>
                                <p className="text-sm text-slate-600">At your table</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    2
                                </div>
                                <h4 className="font-bold text-slate-900 mb-2">Browse Menu</h4>
                                <p className="text-sm text-slate-600">From all vendors</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    3
                                </div>
                                <h4 className="font-bold text-slate-900 mb-2">Add to Cart</h4>
                                <p className="text-sm text-slate-600">From multiple shops</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    4
                                </div>
                                <h4 className="font-bold text-slate-900 mb-2">Checkout</h4>
                                <p className="text-sm text-slate-600">One order, delivered to table</p>
                            </div>
                        </div>
                    </div>

                    {/* Vendor Section */}
                    <div className="mt-20 bg-gradient-to-r from-purple-600 to-purple-700 rounded-3xl p-10 text-white">
                        <h2 className="text-3xl font-bold mb-4">
                            Are you a Vendor?
                        </h2>
                        <p className="text-lg text-purple-100 mb-6">
                            Join our digital food court and reach more customers
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/vendor/signup"
                                className="px-8 py-4 bg-white text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition"
                            >
                                Sign Up as Vendor
                            </Link>
                            <Link
                                href="/vendor/login"
                                className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-purple-600 transition"
                            >
                                Vendor Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-slate-200 py-8 mt-20">
                <div className="container mx-auto px-6 text-center text-slate-600">
                    <p className="mb-2">© 2026 MANOMAY Digital Food Court</p>
                    <p className="text-sm">Powered by AI • Built with Next.js</p>
                </div>
            </footer>
        </div>
    );
}
