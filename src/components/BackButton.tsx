import Link from 'next/link';

interface BackButtonProps {
    href: string;
    label?: string;
}

export default function BackButton({ href, label = 'Back' }: BackButtonProps) {
    return (
        <Link
            href={href}
            className="p-2 hover:bg-slate-100 rounded-lg transition flex items-center gap-1 text-slate-600 hover:text-slate-900 w-fit"
            aria-label="Go back"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
            >
                <path d="m12 19-7-7 7-7"></path>
                <path d="M19 12H5"></path>
            </svg>
            <span className="text-sm font-medium">{label}</span>
        </Link>
    );
}
