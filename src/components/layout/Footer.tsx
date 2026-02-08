import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full bg-white border-t border-slate-100 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="font-display font-bold text-xl text-slate-900">
                            MANO<span className="text-brand-600">MAY</span>
                        </h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Serving the freshest street food with a modern twist. Experience the taste of tradition.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><Link href="/menu" className="hover:text-brand-600 transition-colors">Our Menu</Link></li>
                            <li><Link href="/about" className="hover:text-brand-600 transition-colors">About Us</Link></li>
                            <li><Link href="/help" className="hover:text-brand-600 transition-colors">FAQs</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Contact</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li>123 Food Park Lane</li>
                            <li>Mumbai, MH 400001</li>
                            <li>support@manomay.com</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Follow Us</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="p-2 bg-slate-100 rounded-full hover:bg-brand-100 hover:text-brand-600 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-slate-100 rounded-full hover:bg-brand-100 hover:text-brand-600 transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-slate-100 rounded-full hover:bg-brand-100 hover:text-brand-600 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-100 mt-8 pt-8 text-center text-xs text-slate-400">
                    © {new Date().getFullYear()} Manomay Kiosk. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
