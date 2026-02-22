import { getSession } from '@/lib/auth';
import OrderNotificationProvider from '@/components/OrderNotificationProvider';

/**
 * Customer layout — wraps all /customer/** pages with the
 * live order-ready Toast notification system.
 */
export default async function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    const userId = session?.user?.userId ?? undefined;

    return (
        <OrderNotificationProvider userId={userId}>
            {children}
        </OrderNotificationProvider>
    );
}
