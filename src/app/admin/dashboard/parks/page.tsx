import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getAllParks } from '@/app/actions/admin';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ParksPage() {
    const session = await getSession();

    if (!session || session.user.role !== 'super-admin') {
        redirect('/admin/login');
    }

    const result = await getAllParks();

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900">Food Parks</h1>
                        <p className="text-slate-600">Manage all food court locations</p>
                    </div>
                    <Link
                        href="/admin/dashboard/parks/create"
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-xl transition flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Park
                    </Link>
                </div>

                {/* Parks Grid */}
                {result.parks.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
                        <div className="text-6xl mb-4">🏢</div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">
                            No parks yet
                        </h3>
                        <p className="text-slate-600 mb-6">
                            Create your first food park to start managing vendors and tables
                        </p>
                        <Link
                            href="/admin/dashboard/parks/create"
                            className="inline-flex px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition"
                        >
                            Create First Park
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {result.parks.map((park) => (
                            <Link
                                key={park.id}
                                href={`/admin/dashboard/parks/${park.id}`}
                                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-purple-300 hover:shadow-xl transition"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-1">
                                            {park.name}
                                        </h3>
                                        <p className="text-sm text-slate-600">{park.location}</p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-bold ${park.isActive
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}
                                    >
                                        {park.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-600">
                                    <span>📋 {park.tableCount} tables</span>
                                    <span>📅 {new Date(park.createdAt).toLocaleDateString()}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
