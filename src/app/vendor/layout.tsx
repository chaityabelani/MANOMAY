import Link from 'next/link';
import { getSession } from '@/app/actions/auth';
import { Store, LayoutDashboard, ShoppingBag, FileText, Settings } from 'lucide-react';

export default async function VendorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    // Only show sidebar for authenticated vendor dashboard routes
    // Auth pages (login/signup) won't get the sidebar
    const showSidebar = session?.user?.role === 'vendor';

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Vendor Sidebar - Only for authenticated vendors */}
            {showSidebar && (
                <aside className="w-64 bg-white shadow-lg hidden md:block">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <Store className="w-8 h-8 text-indigo-600" />
                            <h2 className="text-2xl font-bold text-gray-900">Vendor Portal</h2>
                        </div>
                    </div>

                    <nav className="mt-6 px-4 space-y-2">
                        <Link
                            href="/vendor/dashboard"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition-colors"
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            <span className="font-medium">Dashboard</span>
                        </Link>

                        <Link
                            href="/vendor/dashboard/orders"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition-colors"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            <span className="font-medium">Orders</span>
                        </Link>

                        <Link
                            href="/vendor/dashboard/menu"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition-colors"
                        >
                            <FileText className="w-5 h-5" />
                            <span className="font-medium">Menu Management</span>
                        </Link>

                        <Link
                            href="/vendor/dashboard/settings"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition-colors"
                        >
                            <Settings className="w-5 h-5" />
                            <span className="font-medium">Settings</span>
                        </Link>
                    </nav>
                </aside>
            )}

            {/* Main Content Area */}
            <main className={`flex-1 ${showSidebar ? 'p-8' : ''}`}>
                {children}
            </main>
        </div>
    );
}
