"use client";

import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function Header() {
    const { getTotalItems } = useCartStore();
    const itemCount = getTotalItems();
    const pathname = usePathname();

    return (
        <header className="sticky top-4 z-50 w-full mx-auto max-w-7xl px-4">
            <div className="glass rounded-2xl flex h-16 items-center justify-between px-6 transition-all duration-300">
                <Link href="/" className="flex items-center space-x-2 group">
                    <div className="bg-brand-100 p-2 rounded-lg group-hover:bg-brand-200 transition-colors">
                        <UtensilsCrossed className="h-6 w-6 text-brand-600" />
                    </div>
                    <span className="font-display font-bold text-2xl tracking-tight text-slate-800">
                        MANO<span className="text-brand-600">MAY</span>
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    {["Menu", "About", "Help"].map((item) => (
                        <Link
                            key={item}
                            href={`/${item.toLowerCase()}`}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-brand-600",
                                pathname === `/${item.toLowerCase()}` ? "text-brand-600" : "text-slate-600"
                            )}
                        >
                            {item}
                        </Link>
                    ))}
                </nav>

                <Link href="/cart">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative h-12 w-12 rounded-full hover:bg-brand-50 hover:text-brand-600 transition-colors"
                    >
                        <ShoppingBag className="h-6 w-6" />
                        {itemCount > 0 && (
                            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full bg-brand-600 text-white animate-fade-in">
                                {itemCount}
                            </Badge>
                        )}
                        <span className="sr-only">Cart</span>
                    </Button>
                </Link>
            </div>
        </header>
    );
}
