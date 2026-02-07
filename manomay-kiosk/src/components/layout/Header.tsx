"use client";

import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Header() {
    const { getTotalItems } = useCartStore();
    const itemCount = getTotalItems();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="font-bold text-2xl tracking-tight">MANOMAY</span>
                </Link>
                <Link href="/cart">
                    <Button variant="outline" size="icon" className="relative h-12 w-12 rounded-full">
                        <ShoppingBag className="h-6 w-6" />
                        {itemCount > 0 && (
                            <Badge className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center p-0 rounded-full">
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
