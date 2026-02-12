import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getShopOrders } from '@/app/actions/order';
import OrderList from './OrderList';

export default async function VendorOrdersPage() {
    const session = await getSession();

    if (!session || session.user.role !== 'vendor') {
        redirect('/vendor/login');
    }

    // Get vendor's shop orders
    const result = await getShopOrders(session.user.userId);

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
                <p className="text-slate-600">Manage incoming orders from customers</p>
            </div>

            {result.success ? (
                <OrderList initialOrders={result.orders} vendorId={session.user.userId} />
            ) : (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                    {result.error || 'Failed to load orders'}
                </div>
            )}
        </div>
    );
}
