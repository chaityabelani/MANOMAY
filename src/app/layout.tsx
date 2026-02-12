import type { Metadata } from 'next';
import './globals.css';

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
            <body className="antialiased">{children}</body>
        </html>
    );
}
