import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default async function VendorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    // Redirect if not vendor
    if (!session || session.user.role !== 'vendor') {
        redirect('/vendor/login');
    }

    return <>{children}</>;
}
