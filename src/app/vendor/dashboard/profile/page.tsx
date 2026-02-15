import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import BackButton from '@/components/BackButton';
import { logout } from '@/app/actions/auth';

export const dynamic = 'force-dynamic';

export default async function VendorProfilePage() {
    const session = await getSession();

    if (!session || session.user.role !== 'vendor') {
        redirect('/vendor/login');
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-6 py-4">
                    <BackButton href="/vendor/dashboard" />
                </div>
            </header>

            <div className="container mx-auto px-6 py-8 max-w-2xl">
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Profile</h1>
                <p className="text-slate-600 mb-8">Manage your vendor account</p>

                <div className="bg-white rounded-3xl p-8 border border-slate-200">
                    {/* Profile Info */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Name
                            </label>
                            <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900">
                                {session.user.name}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email
                            </label>
                            <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900">
                                {session.user.email}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Vendor ID
                            </label>
                            <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-sm">
                                {session.user.userId}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Account Type
                            </label>
                            <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200">
                                <span className="inline-flex px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-bold">
                                    Vendor Account
                                </span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-200">
                            <h3 className="font-bold text-lg mb-4">Account Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full px-4 py-3 text-left rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50 transition flex justify-between items-center group">
                                    <span className="font-medium text-slate-900 group-hover:text-orange-600">
                                        Change Password
                                    </span>
                                    <span className="text-slate-400 group-hover:text-orange-600">→</span>
                                </button>
                                <form action={logout} className="w-full">
                                    <button
                                        type="submit"
                                        className="w-full px-4 py-3 text-left rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50 transition flex justify-between items-center group"
                                    >
                                        <span className="font-medium text-slate-900 group-hover:text-orange-600">
                                            Logout
                                        </span>
                                        <span className="text-slate-400 group-hover:text-orange-600">→</span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
