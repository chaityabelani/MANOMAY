import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Utensils } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-8 text-center space-y-12 bg-gradient-to-br from-blue-50 via-white to-purple-50 animate-fade-in">
      <div className="space-y-6 max-w-3xl">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-full inline-block mb-6 shadow-2xl transform hover:scale-110 transition-transform duration-300">
          <Utensils className="h-24 w-24 text-white" />
        </div>
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
          Welcome to Manomay
        </h1>
        <p className="text-2xl md:text-3xl text-gray-600 font-medium leading-relaxed">
          Delicious food, served fresh. <br />
          <span className="text-blue-600 font-bold">Touch below to start your order</span>
        </p>
      </div>

      <Link href="/menu" className="transform hover:scale-105 transition-transform">
        <Button size="lg" className="h-28 px-16 text-4xl font-bold rounded-3xl shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 animate-pulse">
          Start Order <ArrowRight className="ml-4 h-10 w-10" />
        </Button>
      </Link>
    </div>
  );
}

