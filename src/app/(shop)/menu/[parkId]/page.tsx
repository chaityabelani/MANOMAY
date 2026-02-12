'use client';

import { useState, useEffect } from 'react';
import { getMenuByPark } from '@/app/actions/park';
import { getSession } from '@/app/actions/auth';
import { ShoppingCart, Plus, Minus, ChefHat, Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import ProfileDropdown from '@/components/ProfileDropdown';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string | null;
}

interface Shop {
    id: string;
    name: string;
    description: string;
    cuisineTypes: string[];
    logo: string | null;
    products: Product[];
}

export default function MenuPage() {
    const params = useParams();
    const parkId = params?.parkId as string;

    const [loading, setLoading] = useState(true);
    const [parkData, setParkData] = useState<any>(null);
    const [shops, setShops] = useState<Shop[]>([]);
    const [selectedShop, setSelectedShopId] = useState<string | null>(null);
    const [cart, setCart] = useState<Record<string, number>>({});
    const [error, setError] = useState<string>('');
    const [session, setSession] = useState<any>(null);

    // Fetch session
    useEffect(() => {
        async function loadSession() {
            const sessionData = await getSession();
            setSession(sessionData);
        }
        loadSession();
    }, []);

    useEffect(() => {
        async function loadMenu() {
            if (!parkId) return;

            setLoading(true);
            const result = await getMenuByPark(parkId);

            if (result.success && result.data) {
                setParkData(result.data.park);
                setShops(result.data.shops);
                if (result.data.shops.length > 0) {
                    setSelectedShopId(result.data.shops[0].id);
                }
            } else {
                setError(result.error || 'Failed to load menu');
            }
            setLoading(false);
        }

        loadMenu();
    }, [parkId]);

    const addToCart = (productId: string) => {
        setCart((prev) => ({
            ...prev,
            [productId]: (prev[productId] || 0) + 1,
        }));
    };

    const removeFromCart = (productId: string) => {
        setCart((prev) => {
            const newCart = { ...prev };
            if (newCart[productId] > 1) {
                newCart[productId]--;
            } else {
                delete newCart[productId];
            }
            return newCart;
        });
    };

    const getCartTotal = () => {
        let total = 0;
        shops.forEach((shop) => {
            shop.products.forEach((product) => {
                if (cart[product.id]) {
                    total += product.price * cart[product.id];
                }
            });
        });
        return total;
    };

    const getCartCount = () => {
        return Object.values(cart).reduce((sum, count) => sum + count, 0);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-brand-600 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
                    <p className="text-red-600 text-lg">{error}</p>
                </div>
            </div>
        );
    }

    const selectedShopData = shops.find((s) => s.id === selectedShop);

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
            {/* Header */}
            <div className="bg-white shadow-lg sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {parkData?.name || 'Food Park'}
                            </h1>
                            {parkData?.location?.address && (
                                <p className="text-sm text-gray-600">{parkData.location.address}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Cart Icon */}
                            {getCartCount() > 0 && (
                                <div className="relative">
                                    <ShoppingCart className="w-8 h-8 text-brand-600" />
                                    <span className="absolute -top-2 -right-2 bg-brand-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                                        {getCartCount()}
                                    </span>
                                </div>
                            )}

                            {/* Profile Dropdown */}
                            {session?.user && (
                                <ProfileDropdown
                                    userName={session.user.name || 'Guest'}
                                    userEmail={session.user.email}
                                    userRole={session.user.role}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Shop Tabs */}
            <div className="bg-white border-b border-gray-200 sticky top-20 z-10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex gap-2 overflow-x-auto pb-2 pt-4 scrollbar-hide">
                        {shops.map((shop) => (
                            <button
                                key={shop.id}
                                onClick={() => setSelectedShopId(shop.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg whitespace-nowrap transition-all ${selectedShop === shop.id
                                        ? 'bg-brand-600 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <ChefHat className="w-5 h-5" />
                                <span className="font-semibold">{shop.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {selectedShopData && (
                    <>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">{selectedShopData.name}</h2>
                            {selectedShopData.description && (
                                <p className="text-gray-600 mt-1">{selectedShopData.description}</p>
                            )}
                            {selectedShopData.cuisineTypes.length > 0 && (
                                <div className="flex gap-2 mt-2">
                                    {selectedShopData.cuisineTypes.map((type) => (
                                        <span
                                            key={type}
                                            className="px-3 py-1 bg-brand-100 text-brand-700 text-sm rounded-full"
                                        >
                                            {type}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {selectedShopData.products.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
                                            <span className="text-brand-600 font-bold text-lg">
                                                ${product.price.toFixed(2)}
                                            </span>
                                        </div>
                                        {product.description && (
                                            <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                                        )}
                                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full mb-4">
                                            {product.category}
                                        </span>

                                        {cart[product.id] ? (
                                            <div className="flex items-center justify-between bg-brand-100 rounded-lg p-2">
                                                <button
                                                    onClick={() => removeFromCart(product.id)}
                                                    className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                                                >
                                                    <Minus className="w-4 h-4 text-brand-600" />
                                                </button>
                                                <span className="font-bold text-brand-600">{cart[product.id]}</span>
                                                <button
                                                    onClick={() => addToCart(product.id)}
                                                    className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                                                >
                                                    <Plus className="w-4 h-4 text-brand-600" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => addToCart(product.id)}
                                                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add to Cart
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Floating Cart Total */}
            {getCartCount() > 0 && (
                <div className="fixed bottom-6 right-6 bg-brand-600 text-white rounded-2xl shadow-2xl p-6 min-w-64">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">Total ({getCartCount()} items)</span>
                        <span className="text-2xl font-bold">${getCartTotal().toFixed(2)}</span>
                    </div>
                    <button className="w-full bg-white text-brand-600 font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors mt-2">
                        Checkout
                    </button>
                </div>
            )}
        </div>
    );
}
