import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 w-full overflow-hidden bg-white">
      {/* Hero Section */}
      <section className="relative w-full min-h-[calc(100vh-80px)] flex items-center justify-center p-6 md:p-12 lg:p-20 bg-mandala">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

          {/* Left Column: Content */}
          <div className="flex flex-col space-y-8 z-10 animate-fade-in order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-brand-200 bg-orange-50/50 w-fit text-brand-700 text-sm font-semibold tracking-wide uppercase shadow-sm">
              <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse"></span>
              Authentic Mumbai Street Food
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-slate-900 drop-shadow-sm">
              Taste the <br />
              <span className="text-brand-600 italic relative inline-block">
                Tradition
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-brand-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-lg leading-relaxed font-light">
              Experience authentic Indian Street Food, Reimagined.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/menu" className="group relative px-8 py-4 btn-gradient text-white font-semibold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 text-center min-w-[180px]">
                <span className="relative flex items-center justify-center gap-2">
                  Order Now <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4 pt-8 opacity-80">
              {/* Kept existing social proof */}
            </div>
          </div>

          {/* Right Column: Visuals */}
          <div className="relative z-0 order-1 lg:order-2 flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {/* Main Image Container */}
            <div className="relative w-full max-w-lg lg:max-w-xl aspect-square">
              <div className="absolute inset-0 rounded-[3rem] rotate-3 bg-slate-200/50 backdrop-blur-sm -z-10 transform translate-x-4 translate-y-4"></div>

              <div className="relative w-full h-full rounded-[2.5rem] shadow-2xl overflow-hidden border-[8px] border-white">
                <Image
                  src="https://images.unsplash.com/photo-1606491956689-2ea28c674675?q=80&w=1000&auto=format&fit=crop"
                  alt="Delicious Pav Bhaji"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Floating Card 1 (Top Right) */}
              <div className="absolute -top-6 -right-6 glass rounded-2xl p-3 shadow-xl border border-white/60 z-20 animate-float w-44">
                <div className="relative h-24 w-full rounded-xl overflow-hidden mb-2">
                  <Image src="https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=300&q=80" alt="Dahi Puri" fill className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Dahi Puri Chaat</p>
                  <p className="text-xs text-slate-500 truncate">Tangy & Spicy</p>
                  <p className="text-sm font-bold text-brand-600 mt-1">₹60</p>
                </div>
              </div>

              {/* Floating Card 2 (Bottom Left) */}
              <div className="absolute -bottom-10 -left-6 glass rounded-2xl p-3 shadow-xl border border-white/60 z-20 animate-float w-44" style={{ animationDelay: '1.5s' }}>
                <div className="relative h-24 w-full rounded-xl overflow-hidden mb-2">
                  <Image src="https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=300&q=80" alt="Sev Puri" fill className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Sev Puri</p>
                  <p className="text-xs text-slate-500 truncate">Crispy Delight</p>
                  <p className="text-sm font-bold text-brand-600 mt-1">₹50</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
