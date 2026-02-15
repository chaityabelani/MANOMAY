import Link from 'next/link';

/**
 * BackButton Component
 * 
 * A standardized, reusable back button component used across the application
 * for consistent navigation UI. Matches the design pattern established in the
 * Browse Menu page.
 * 
 * Features:
 * - Consistent styling across all pages
 * - Subtle hover effects (background fill)
 * - Accessible with proper semantic HTML
 * - Responsive padding and spacing
 * 
 * @param {string} href - The destination URL to navigate back to
 * @param {string} label - Optional custom label (defaults to "Back")
 */

interface BackButtonProps {
    href: string;
    label?: string;
}

export default function BackButton({ href, label = "Back" }: BackButtonProps) {
    return (
        <Link
            href={href}
            className="p-2 hover:bg-slate-100 rounded-lg transition flex items-center gap-1 text-slate-600 hover:text-slate-900 w-fit"
        >
            <span className="text-sm font-medium">← {label}</span>
        </Link>
    );
}
