import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full min-h-[calc(100vh-80px)] flex items-center justify-center p-6 md:p-12 lg:p-20">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

          {/* Left Column: Content */}
          <div className="flex flex-col space-y-8 z-10 animate-fade-in order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-brand-200 bg-orange-50/50 w-fit text-brand-700 text-sm font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse"></span>
              Authentic Mumbai Street Food
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-slate-900">
              Taste the <br />
              <span className="text-brand-600 italic relative inline-block">
                Tradition
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-brand-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-lg leading-relaxed font-light">
              Experience the vibrant flavors of India, crafted with passion and served with a story. From spicy Pav Bhaji to refreshing Chaat.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/menu" className="group relative px-8 py-4 bg-brand-600 text-white font-semibold rounded-full overflow-hidden shadow-xl shadow-orange-200 transition-all hover:scale-105 active:scale-95 text-center">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative flex items-center justify-center gap-2">
                  Order Now <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link href="/menu" className="px-8 py-4 bg-white text-slate-900 font-medium rounded-full border border-slate-200 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md flex items-center justify-center">
                View Menu
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4 pt-8 opacity-80">
              <div className="flex -space-x-3">
                {[
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64",
                  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64"
                ].map((src, i) => (
                  <div key={i} className="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                    <Image src={src} alt="User" fill className="object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-sm text-slate-500 font-medium">
                <span className="text-brand-600 font-bold">4.9/5</span> from 2,000+ cravings
              </div>
            </div>
          </div>

          {/* Right Column: Visuals */}
          <div className="relative z-0 order-1 lg:order-2 flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {/* Simple decorative background behind image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-100/50 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>

            {/* Main Image Container */}
            <div className="relative w-full max-w-lg lg:max-w-xl aspect-square animate-float">
              <div className="absolute inset-0 rounded-[3rem] rotate-3 bg-slate-900/5 backdrop-blur-sm -z-10 transform translate-x-4 translate-y-4"></div>

              <div className="relative w-full h-full rounded-[2.5rem] shadow-2xl overflow-hidden border-[6px] border-white">
                <Image
                  src="https://images.unsplash.com/photo-1606491956689-2ea28c674675?q=80&w=1000&auto=format&fit=crop"
                  alt="Delicious Pav Bhaji"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/40 z-20 flex items-center gap-3 animate-float" style={{ animationDelay: '1s' }}>
                <div className="bg-green-100 p-2 rounded-full text-green-600">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Prep Time</p>
                  <p className="text-slate-900 font-bold">~15 Mins</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
