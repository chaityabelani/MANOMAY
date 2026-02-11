import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getSession } from "@/app/actions/auth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Manomay Kiosk",
  description: "Delicious street food, served fresh.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const user = session?.user || null;

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* 🚨 THE FIX: Loading Tailwind directly from the internet to bypass build errors */}
        <script src="https://cdn.tailwindcss.com"></script>

        {/* 🚨 THE CONFIG: Telling the browser your custom brand colors */}
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    brand: {
                      50: '#fff7ed',
                      100: '#ffedd5',
                      200: '#fed7aa',
                      300: '#fdba74',
                      400: '#fb923c',
                      500: '#f97316',
                      600: '#ea580c',
                      700: '#c2410c',
                      800: '#9a3412',
                      900: '#7c2d12',
                    }
                  },
                  fontFamily: {
                    display: ['Playfair Display', 'serif'],
                    sans: ['Inter', 'sans-serif'],
                  }
                }
              }
            }
          `
        }} />

        {/* 🚨 THE STYLES: Custom glass effects that Tailwind CDN doesn't have by default */}
        <style>{`
          .glass-pro {
            background: rgba(255, 255, 255, 0.65);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.5);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          }
          .btn-primary-glow {
            background: linear-gradient(180deg, #EA580C 0%, #C2410C 100%);
            box-shadow: 0 4px 0px 0px #9A3412, 0 10px 20px -5px rgba(234, 88, 12, 0.4);
            transition: all 0.2s ease;
          }
          .bg-mandala-watermark {
             background-color: #FAFAFA;
             background-image: radial-gradient(#e5e7eb 1px, transparent 1px);
             background-size: 20px 20px;
          }
        `}</style>
      </head>
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col bg-mandala-watermark">
          <Header user={user} />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
