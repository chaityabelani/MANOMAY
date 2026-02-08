"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Header() {
    const pathname = usePathname();
    const { getTotalItems } = useCartStore();
    const itemCount = getTotalItems();

    return (
        /* Removed "glass" class from header wrapper to make it transparent like screenshot */
        <header className="sticky top-0 z-50 w-full mx-auto max-w-7xl px-6 py-6 font-sans">
            <div className="flex items-center justify-between">

                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="h-10 w-10 bg-brand-600 rounded-lg flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg">
                        M
                    </div>
                    <span className="font-display font-bold text-2xl text-slate-900">
                        Manomay
                    </span>
                </Link>

                {/* Navigation Pill - Matches Reference Screenshot */}
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-2 py-2 rounded-full shadow-sm border border-slate-100">
                    <nav className="hidden md:flex items-center">
                        {["Menu", "About"].map((item) => (
                            <Link
                                key={item}
                                href={`/${item.toLowerCase()}`}
                                className={cn(
                                    "px-5 py-2 text-sm font-medium rounded-full transition-all",
                                    pathname === `/${item.toLowerCase()}`
                                        ? "bg-slate-900 text-white shadow-md"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                )}
                            >
                                {item}
                            </Link>
                        ))}
                    </nav>

                    {/* Cart/User Icon Circle */}
                    <Link href="/cart">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-full bg-slate-100 hover:bg-brand-100 hover:text-brand-600 ml-1 relative"
                        >
                            <ShoppingBag className="h-5 w-5" />
                            {itemCount > 0 && (
                                <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                            )}
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
