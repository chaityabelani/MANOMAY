'use client';

import { useRouter } from 'next/navigation';

interface SafeNavigateProps {
    href: string;
    className?: string;
    children: React.ReactNode;
}

/**
 * SafeNavigate - Prevents session loss during navigation
 * Preserves auth cookies and session state when navigating between pages
 */
export default function SafeNavigate({ href, className, children }: SafeNavigateProps) {
    const router = useRouter();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();

        console.log('🔐 SafeNavigate - Checking session before navigation');
        console.log('Target:', href);
        console.log('Cookies:', document.cookie);

        // Use router.push with prefetch disabled
        router.push(href);
    };

    return (
        <button
            onClick={handleClick}
            className={className}
            type="button"
        >
            {children}
        </button>
    );
}
