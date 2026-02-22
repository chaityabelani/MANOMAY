import OrderNotificationProvider from '@/components/OrderNotificationProvider';

export default async function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <OrderNotificationProvider>
            {children}
        </OrderNotificationProvider>
    );
}
