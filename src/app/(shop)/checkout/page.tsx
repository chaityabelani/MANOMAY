"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { createOrder } from "@/app/actions/order";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CreditCard, Loader2, Wallet } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const { items, clearCart, getTotalPrice } = useCartStore();
    const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");
    const [orderNumber, setOrderNumber] = useState<string>("");
    const router = useRouter();
    const total = getTotalPrice();

    useEffect(() => {
        if (status === "success") {
            const timer = setTimeout(() => {
                clearCart();
                router.push("/");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [status, clearCart, router]);

    const handlePayment = async () => {
        setStatus("processing");

        // Call the server action to save the order
        const result = await createOrder(items, total);

        if (result.success) {
            setOrderNumber(result.orderNumber || "");
            setStatus("success");
        } else {
            alert("Order failed: " + (result.error || "Unknown error"));
            setStatus("idle");
        }
    };

    if (status === "success") {
        return (
            <div className="flex flex-col items-center justify-center flex-1 p-8 text-center animate-in fade-in zoom-in duration-500">
                <CheckCircle2 className="h-32 w-32 text-green-500 mb-6" />
                <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
                {orderNumber && (
                    <p className="text-2xl font-semibold text-primary mb-4">
                        Order {orderNumber}
                    </p>
                )}
                <p className="text-xl text-muted-foreground mb-8">
                    Please take your receipt from the counter.
                </p>
                <p className="text-sm text-muted-foreground">Redirecting to home...</p>
            </div>
        );
    }

    return (
        <div className="container max-w-2xl py-12 space-y-8">
            <h1 className="text-3xl font-bold text-center">Payment Method</h1>
            <div className="p-6 bg-muted/20 rounded-xl text-center mb-8">
                <p className="text-muted-foreground mb-1">Total to Pay</p>
                <p className="text-4xl font-bold text-primary">₹{total}</p>
            </div>

            <div className="grid gap-4">
                <Button
                    size="lg"
                    variant="outline"
                    className="h-24 text-xl justify-start px-8 gap-4 border-2 hover:border-primary hover:bg-primary/5"
                    onClick={handlePayment}
                    disabled={status === "processing"}
                >
                    <CreditCard className="h-8 w-8" />
                    <div className="flex flex-col items-start">
                        <span className="font-bold">Card Payment</span>
                        <span className="text-sm font-normal text-muted-foreground">Credit / Debit</span>
                    </div>
                </Button>

                <Button
                    size="lg"
                    variant="outline"
                    className="h-24 text-xl justify-start px-8 gap-4 border-2 hover:border-primary hover:bg-primary/5"
                    onClick={handlePayment}
                    disabled={status === "processing"}
                >
                    <Wallet className="h-8 w-8" />
                    <div className="flex flex-col items-start">
                        <span className="font-bold">UPI / Wallet</span>
                        <span className="text-sm font-normal text-muted-foreground">GPay, PhonePe, Paytm</span>
                    </div>
                </Button>
            </div>

            {status === "processing" && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="text-xl font-medium">Processing Payment...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
