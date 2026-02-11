import { getSession } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import Link from 'next/link';

export default async function VendorDashboard() {
    const session = await getSession();
    if (!session || !session.user) redirect('/login');
    if (session.user.role !== 'vendor' && session.user.role !== 'superadmin') {
        redirect('/vendor/register');
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-playfair font-bold text-gray-900">Dashboard</h1>
                <Link href="/vendor/menu" className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                    Upload Menu (AI)
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Active Orders</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Total Revenue</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">₹0.00</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Menu Items</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center py-12">
                <p className="text-gray-500 mb-4">You have no active orders yet.</p>
                <Link href="/vendor/menu" className="text-orange-600 font-medium hover:underline">
                    Add items to your menu to get started &rarr;
                </Link>
            </div>
        </div>
    );
}
