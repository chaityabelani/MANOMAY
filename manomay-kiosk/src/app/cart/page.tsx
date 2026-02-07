"use client";

import { CartSummary } from "@/components/feature/CartSummary";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
    return (
        <div className="container max-w-4xl py-8 space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/menu">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">Review Order</h1>
            </div>

            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                <CartSummary />
            </div>
        </div>
    );
}
