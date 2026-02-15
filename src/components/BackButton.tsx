import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
    href: string;
    label?: string;
}

export default function BackButton({ href, label = "Back" }: BackButtonProps) {
    return (
        <Link
            href={href}
            className="p-2 hover:bg-slate-100 rounded-lg transition flex items-center gap-1 text-slate-600 hover:text-slate-900 w-fit"
            aria-label="Go back"
        >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">{label}</span>
        </Link>
    );
}
