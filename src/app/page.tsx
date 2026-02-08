import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Utensils, Clock, BadgeCheck, ChefHat } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 w-full">
      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-brand-50 via-white to-red-50 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-200 rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-orange-300 rounded-full blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

        <div className="container relative z-10 px-4 md:px-6 mx-auto">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="flex flex-col justify-center space-y-8 animate-fade-in">
              <div className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600 w-fit">
                <span className="flex h-2 w-2 rounded-full bg-brand-600 mr-2 animate-pulse"></span>
                Manomay Kiosk
              </div>
              <div className="space-y-4">
                <h1 className="text-5xl font-display font-bold tracking-tight sm:text-6xl xl:text-7xl/none text-slate-900">
                  Taste the <br />
                  <span className="text-brand-600 italic">Tradition</span>
                </h1>
                <p className="max-w-[600px] text-slate-600 md:text-xl leading-relaxed">
                  Experience authentic modern Indian street food.
                  Fresh ingredients, secret recipes, and served with a smile.
                </p>
              </div>
              <div className="flex flex-col gap-4 min-[400px]:flex-row">
                <Link href="/menu">
                  <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-brand-600 hover:bg-brand-700 shadow-xl shadow-brand-200 transition-all hover:scale-105 active:scale-95">
                    Order Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/menu">
                  <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-white hover:text-brand-600">
                    View Menu
                  </Button>
                </Link>
              </div>
            </div>

            {/* Visual Placeholder for Hero Image */}
            <div className="relative mx-auto lg:ml-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="relative h-[350px] w-[350px] sm:h-[450px] sm:w-[450px] lg:h-[500px] lg:w-[500px]">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-100 to-orange-50 rounded-full animate-float"></div>
                <div className="absolute inset-4 bg-white/40 backdrop-blur-md rounded-full shadow-2xl border border-white/50 flex items-center justify-center">
                  <ChefHat className="w-32 h-32 text-brand-600 opacity-20" />
                  <span className="absolute mt-40 font-display font-bold text-2xl text-brand-800 opacity-40">Delicious</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Fresh Ingredients", icon: Utensils, desc: "Locally sourced farm-fresh produce daily." },
              { title: "Quick Service", icon: Clock, desc: "Ready in minutes, so you don't have to wait." },
              { title: "Top Quality", icon: BadgeCheck, desc: "Highest hygiene standards for your safety." }
            ].map((feature, i) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl border bg-slate-50 p-8 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="mb-4 inline-block rounded-xl bg-white p-3 shadow-sm group-hover:bg-brand-100 group-hover:text-brand-600 transition-colors">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

