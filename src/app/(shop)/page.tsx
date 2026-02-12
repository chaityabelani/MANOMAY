import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 w-full overflow-hidden">
      <section className="relative w-full min-h-[calc(100vh-80px)] flex items-center justify-center p-6 lg:p-12">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* LEFT: Text Content */}
          <div className="lg:col-span-5 flex flex-col space-y-8 z-10 order-2 lg:order-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-bold tracking-widest text-slate-500 uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                Manomay Kiosk
              </span>
            </div>

            <h1 className="font-display font-bold text-6xl md:text-7xl lg:text-8xl leading-[0.9] text-slate-900 tracking-tight">
              Taste the <br />
              <span className="text-slate-900">Tradition</span>
            </h1>

            <p className="text-xl text-slate-600 font-medium max-w-md leading-relaxed">
              Authentic Indian Street Food, <br />
              <span className="text-slate-900 font-semibold">Reimagined.</span>
            </p>

            <div className="pt-6">
              <Link href="/menu" className="btn-primary-glow inline-flex items-center justify-center px-10 py-5 text-white font-bold rounded-full text-lg min-w-[200px]">
                Order Now
              </Link>
            </div>
          </div>

          {/* RIGHT: Visuals */}
          <div className="lg:col-span-7 relative z-0 order-1 lg:order-2 h-full min-h-[500px] flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-2xl aspect-[4/3]">

              {/* Main Image - Switched to Vada Pav (Strictly Veg) */}
              <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl border-[8px] border-white">
                <img
                  src="https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=1000"
                  alt="Famous Mumbai Vada Pav"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Card 1 - Samosa (Veg) */}
              <div className="absolute top-8 -right-4 glass-pro rounded-2xl p-3 w-48 z-20 shadow-xl bg-white/80 backdrop-blur-md">
                <div className="relative h-28 w-full rounded-xl overflow-hidden mb-3">
                  <img src="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=300&q=80" alt="Samosa Plate" className="w-full h-full object-cover" />
                </div>
                <div className="px-1">
                  <h3 className="font-bold text-slate-900 text-sm">Samosa Plate</h3>
                  <p className="text-xs text-slate-500 mb-2">With mint chutney</p>
                  <p className="font-bold text-slate-900">₹45</p>
                </div>
              </div>

              {/* Floating Card 2 - Dahi Puri (Veg) */}
              <div className="absolute -bottom-6 -left-4 glass-pro rounded-2xl p-3 w-44 z-20 shadow-xl bg-white/80 backdrop-blur-md">
                <div className="relative h-24 w-full rounded-xl overflow-hidden mb-3">
                  <img src="https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=300&q=80" alt="Dahi Puri" className="w-full h-full object-cover" />
                </div>
                <div className="px-1">
                  <h3 className="font-bold text-slate-900 text-sm">Dahi Puri</h3>
                  <p className="text-xs text-slate-500 mb-2">Sweet & Tangy</p>
                  <p className="font-bold text-slate-900">₹60</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
