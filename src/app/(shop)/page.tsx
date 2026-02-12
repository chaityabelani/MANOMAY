import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export default async function Home() {
  // Fetch 2 featured products from database
  await connectDB();
  const featuredItems = await Product.find({ isAvailable: true })
    .limit(2)
    .lean();

  // Convert MongoDB documents to plain objects
  const products = featuredItems.map(p => ({
    id: p._id.toString(),
    name: p.name,
    description: p.description,
    price: p.price,
    image: p.image || 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=1000'
  }));

  return (
    <div className="flex flex-col flex-1 w-full overflow-hidden bg-slate-50">
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] md:min-h-[calc(100vh-80px)] flex items-center justify-center p-6 lg:p-12">
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
                Order Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* RIGHT: Visuals */}
          <div className="lg:col-span-7 relative z-0 order-1 lg:order-2 h-full min-h-[500px] flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-2xl aspect-[4/3]">

              {/* Main Image */}
              <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl border-[8px] border-white">
                <Image
                  src="https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=1000"
                  alt="Famous Mumbai Vada Pav"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Floating Card 1 - Dynamic */}
              {products[0] && (
                <div className="absolute top-8 -right-4 glass-pro rounded-2xl p-3 w-48 z-20 shadow-xl bg-white/80 backdrop-blur-md animate-float">
                  <div className="relative h-28 w-full rounded-xl overflow-hidden mb-3">
                    <Image
                      src={products[0].image}
                      alt={products[0].name}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  </div>
                  <div className="px-1">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{products[0].name}</h3>
                    <p className="text-xs text-slate-500 mb-2 line-clamp-1">{products[0].description}</p>
                    <p className="font-bold text-slate-900">₹{products[0].price}</p>
                  </div>
                </div>
              )}

              {/* Floating Card 2 - Dynamic */}
              {products[1] && (
                <div className="absolute -bottom-6 -left-4 glass-pro rounded-2xl p-3 w-44 z-20 shadow-xl bg-white/80 backdrop-blur-md animate-float-delayed">
                  <div className="relative h-24 w-full rounded-xl overflow-hidden mb-3">
                    <Image
                      src={products[1].image}
                      alt={products[1].name}
                      fill
                      className="object-cover"
                      sizes="180px"
                    />
                  </div>
                  <div className="px-1">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{products[1].name}</h3>
                    <p className="text-xs text-slate-500 mb-2 line-clamp-1">{products[1].description}</p>
                    <p className="font-bold text-slate-900">₹{products[1].price}</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-slate-900 mb-3">How it Works</h2>
            <p className="text-slate-600 text-lg">Order your favorite food in 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200 text-center hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-lg">
                📱
              </div>
              <div className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">STEP 1</div>
              <h3 className="font-bold text-2xl mb-3 text-slate-900">Browse Menu</h3>
              <p className="text-slate-600 leading-relaxed">Explore delicious dishes from multiple food stalls in one place.</p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 text-center hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-lg">
                🛒
              </div>
              <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">STEP 2</div>
              <h3 className="font-bold text-2xl mb-3 text-slate-900">Add to Cart</h3>
              <p className="text-slate-600 leading-relaxed">Select items and pay securely online in seconds.</p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 text-center hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-lg">
                🍽️
              </div>
              <div className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">STEP 3</div>
              <h3 className="font-bold text-2xl mb-3 text-slate-900">Enjoy Food</h3>
              <p className="text-slate-600 leading-relaxed">Pick up your freshly prepared order when ready!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-500">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-display font-bold text-white mb-4">Ready to Order?</h2>
          <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of food lovers enjoying authentic street food at Manomay
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center px-10 py-5 bg-white text-orange-600 font-bold rounded-full text-lg hover:shadow-2xl hover:scale-105 transition-all"
          >
            Explore Menu <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
