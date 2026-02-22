import type { Metadata } from 'next';
import './globals.css';
import OrderNotificationProvider from '@/components/OrderNotificationProvider';

export const metadata: Metadata = {
    title: 'MANOMAY - Digital Food Court',
    description: 'India\'s first AI-powered digital food court. Order from multiple vendors in one cart.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="antialiased">
                <OrderNotificationProvider>
                    {children}
                </OrderNotificationProvider>
            </body>
        </html>
    );
}
