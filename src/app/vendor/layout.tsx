import { getSession } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import Link from 'next/link';

export default async function VendorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    if (!session || !session.user) redirect('/login');
    if (session.user.role !== 'vendor' && session.user.role !== 'superadmin') {
        // If they are not a vendor yet, checking if they should be?
        // For now, redirect to /profile or let them see this if we handle partial onboarding
        redirect('/vendor/register');
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile-friendly Sidebar (Hidden on small screens for MVP, simplified) */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:block fixed h-full z-10">
                <div className="p-6">
                    <h2 className="text-2xl font-playfair font-bold text-orange-600">Vendor Portal</h2>
                </div>
                <nav className="mt-6 px-4 space-y-2">
                    <Link href="/vendor/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors font-medium">
                        Dashboard
                    </Link>
                    <Link href="/vendor/menu" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors font-medium">
                        Menu Management
                    </Link>
                    <Link href="/vendor/orders" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors font-medium">
                        Live Orders
                    </Link>
                    <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors font-medium">
                        Settings
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}
