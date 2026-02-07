import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Utensils } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-8 text-center space-y-8 bg-gradient-to-b from-background to-muted/20">
      <div className="space-y-4 max-w-2xl">
        <div className="bg-primary/10 p-6 rounded-full inline-block mb-4">
          <Utensils className="h-20 w-20 text-primary" />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight lg:text-7xl">
          Welcome to <span className="text-primary">Manomay</span>
        </h1>
        <p className="text-2xl text-muted-foreground">
          Delicious food, served fresh. Touch below to start your order.
        </p>
      </div>

      <Link href="/menu">
        <Button size="lg" className="h-24 px-12 text-3xl font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform">
          Start Order <ArrowRight className="ml-4 h-8 w-8" />
        </Button>
      </Link>
    </div>
  );
}
