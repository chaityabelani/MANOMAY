import Link from 'next/link';

export default function ConfirmationPage({
    searchParams,
}: {
    searchParams: { orders?: string };
}) {
    const orderIds = searchParams.orders?.split(',') || [];

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                {/* Success Animation */}
                <div className="mb-6">
                    <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center text-5xl animate-bounce">
                        ✅
                    </div>
                </div>

                {/* Success Message */}
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Order Placed Successfully!
                </h1>
                <p className="text-slate-600 mb-8">
                    Your order has been sent to the kitchen. Sit back and relax!
                </p>

                {/* Order Details */}
                <div className="bg-white rounded-2xl p-6 mb-6 border-2 border-green-200">
                    <h2 className="font-bold text-slate-900 mb-3">Order Details</h2>
                    <div className="text-sm text-slate-600 space-y-2">
                        <p>
                            <span className="font-semibold">Orders Created:</span> {orderIds.length}
                        </p>
                        <p className="text-xs text-slate-500">
                            (Your items have been split across {orderIds.length} vendor{orderIds.length > 1 ? 's' : ''})
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <Link
                        href="/menu"
                        className="block w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold py-4 rounded-xl hover:shadow-xl transition"
                    >
                        Order More
                    </Link>
                    <Link
                        href="/"
                        className="block w-full bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition"
                    >
                        Back to Home
                    </Link>
                </div>

                {/* Info Message */}
                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-800">
                        💡 Food will be delivered to your table once ready
                    </p>
                </div>
            </div>
        </div>
    );
}
