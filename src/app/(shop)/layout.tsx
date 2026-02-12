import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getSession } from "@/app/actions/auth";

export default async function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    const user = session?.user || null;

    return (
        <div className="flex min-h-screen flex-col bg-mandala-watermark">
            <Header user={user} />
            <main className="flex-1 flex flex-col">
                {children}
            </main>
            <Footer />
        </div>
    );
}
