import Link from 'next/link';
import { ShoppingBag, Sparkles, Zap, Users, QrCode, Store } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-orange-500/20 via-purple-500/20 to-pink-500/20 blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/20 via-cyan-500/20 to-teal-500/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-10 border-b border-white/10 backdrop-blur-xl bg-white/5">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">🍽️</span>
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                                MANOMAY
                            </h1>
                        </div>
                        <Link
                            href="/vendor/login"
                            className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition backdrop-blur-sm border border-white/20"
                        >
                            Vendor Portal
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative z-10 container mx-auto px-6 py-20">
                <div className="text-center max-w-5xl mx-auto">
                    {/* Main Headline */}
                    <div className="mb-8 animate-fade-in">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                            <Sparkles className="w-4 h-4 text-orange-400" />
                            <span className="text-sm text-white/90">India's First AI-Powered Digital Food Court</span>
                        </div>
                        <h1 className="text-7xl md:text-8xl font-black mb-6">
                            <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                                Order Food
                            </span>
                            <br />
                            <span className="text-white">Like Never Before</span>
                        </h1>
                        <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                            Scan. Browse. Order from multiple vendors. All in one unified cart.
                            The future of food court ordering is here.
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
                        <Link
                            href="/menu"
                            className="group relative px-8 py-4 rounded-2xl overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 group-hover:scale-105 transition-transform"></div>
                            <div className="relative flex items-center gap-3 text-white font-bold text-lg">
                                <ShoppingBag className="w-6 h-6" />
                                <span>Explore Menu</span>
                                <Zap className="w-5 h-5 animate-pulse" />
                            </div>
                        </Link>
                        <Link
                            href="/vendor/signup"
                            className="px-8 py-4 rounded-2xl backdrop-blur-sm bg-white/10 hover:bg-white/20 border-2 border-white/30 text-white font-bold text-lg transition flex items-center gap-3 justify-center"
                        >
                            <Store className="w-6 h-6" />
                            <span>Join as Vendor</span>
                        </Link>
                    </div>

                    {/* Feature Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                        {/* Card 1 */}
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition"></div>
                            <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 hover:border-white/40 transition">
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                                    <QrCode className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">
                                    QR Code Magic
                                </h3>
                                <p className="text-white/60 leading-relaxed">
                                    Just scan the QR code at your table and instantly access the entire food court menu
                                </p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition"></div>
                            <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 hover:border-white/40 transition">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                                    <ShoppingBag className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">
                                    Unified Cart
                                </h3>
                                <p className="text-white/60 leading-relaxed">
                                    Order from multiple vendors in ONE cart. One checkout. One delivery to your table
                                </p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition"></div>
                            <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 hover:border-white/40 transition">
                                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6">
                                    <Sparkles className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">
                                    AI-Powered
                                </h3>
                                <p className="text-white/60 leading-relaxed">
                                    Vendors use AI to instantly digitize menus. Upload a photo, get instant menu setup
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* How It Works Section */}
                    <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-12 border border-white/10 mb-20">
                        <h2 className="text-4xl font-bold text-white mb-12">
                            How It Works
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {[
                                { step: "01", icon: "📱", title: "Scan QR", desc: "At your table" },
                                { step: "02", icon: "🍕", title: "Browse", desc: "All vendors" },
                                { step: "03", icon: "🛒", title: "Add to Cart", desc: "Multiple shops" },
                                { step: "04", icon: "✅", title: "Checkout", desc: "One order" }
                            ].map((item) => (
                                <div key={item.step} className="relative">
                                    <div className="text-6xl font-black text-white/5 absolute -top-4 left-0">{item.step}</div>
                                    <div className="relative">
                                        <div className="text-5xl mb-4">{item.icon}</div>
                                        <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                                        <p className="text-white/60">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Vendor CTA Section */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl blur-2xl group-hover:blur-3xl transition opacity-50"></div>
                        <div className="relative backdrop-blur-xl bg-gradient-to-r from-purple-900/50 to-orange-900/50 rounded-3xl p-12 border border-white/20">
                            <div className="flex items-center gap-3 justify-center mb-4">
                                <Users className="w-8 h-8 text-white" />
                                <h2 className="text-4xl font-bold text-white">
                                    Calling All Vendors!
                                </h2>
                            </div>
                            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                                Join India's most advanced digital food court platform. AI menu scanning, real-time order management, and instant customer reach.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/vendor/signup"
                                    className="px-8 py-4 rounded-2xl bg-white text-purple-600 font-bold text-lg hover:scale-105 transition"
                                >
                                    Start Free Trial
                                </Link>
                                <Link
                                    href="/vendor/login"
                                    className="px-8 py-4 rounded-2xl backdrop-blur-sm bg-white/10 hover:bg-white/20 border-2 border-white/30 text-white font-bold text-lg transition"
                                >
                                    Vendor Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/10 backdrop-blur-xl bg-white/5 py-8 mt-20">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-white/60 mb-2">© 2026 MANOMAY Digital Food Court</p>
                    <p className="text-sm text-white/40">Powered by AI • Built with Next.js • Designed for the Future</p>
                </div>
            </footer>
        </div>
    );
}
