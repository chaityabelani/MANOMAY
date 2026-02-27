import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getParkDetails } from '@/app/actions/admin';
import Link from 'next/link';
import BackButton from '@/components/BackButton';

export const dynamic = 'force-dynamic';

export default async function ParkDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || session.user.role !== 'super-admin') redirect('/admin/login');

    const { id } = await params;
    const result = await getParkDetails(id);

    if (!result.success || !result.park) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🏢</div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Park Not Found</h2>
                    <Link href="/admin/dashboard/parks" className="text-purple-600 hover:underline">← Back to Parks</Link>
                </div>
            </div>
        );
    }

    const park = result.park;

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <BackButton href="/admin/dashboard/parks" label="Back to Parks" />
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${park.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {park.isActive ? '✅ Active' : '❌ Inactive'}
                    </span>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8">
                {/* Park header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-3xl p-8 mb-8">
                    <h1 className="text-4xl font-bold mb-1">{park.name}</h1>
                    <p className="text-purple-200">📍 {park.location}</p>
                    <p className="text-purple-200 text-sm mt-1">
                        Created {new Date(park.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 text-center">
                        <div className="text-3xl font-extrabold text-purple-600">{park.tables.length}</div>
                        <div className="text-sm text-slate-600 mt-1">Total Tables</div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 text-center">
                        <div className="text-3xl font-extrabold text-green-600">
                            {park.tables.filter((t: any) => t.isActive !== false).length}
                        </div>
                        <div className="text-sm text-slate-600 mt-1">Active Tables</div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 text-center">
                        <div className="text-3xl font-extrabold text-blue-600">{park.tables.length}</div>
                        <div className="text-sm text-slate-600 mt-1">QR Codes</div>
                    </div>
                </div>

                {/* Tables list with QR links */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-slate-900">Tables & QR Codes</h2>
                        <span className="text-sm text-slate-500">{park.tables.length} tables configured</span>
                    </div>

                    {park.tables.length === 0 ? (
                        <p className="text-slate-600 text-center py-8">No tables configured for this park.</p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {park.tables.map((table: any, idx: number) => (
                                <div key={idx} className="border border-slate-200 rounded-xl p-3 text-center hover:border-purple-300 hover:shadow-md transition">
                                    <div className="text-2xl font-extrabold text-slate-900 mb-1">
                                        {table.number}
                                    </div>
                                    <div className="text-xs text-slate-500 mb-2">Table</div>
                                    {table.qrCode && (
                                        <a
                                            href={table.qrCode}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-purple-600 hover:text-purple-800 font-medium underline"
                                        >
                                            QR Link ↗
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
