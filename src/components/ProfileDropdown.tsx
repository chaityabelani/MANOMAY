'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logoutAction } from '@/app/actions/auth';
import { User, LogOut, ChevronDown, Settings, ShoppingBag, Store } from 'lucide-react';

interface ProfileDropdownProps {
    userName?: string;
    userEmail?: string;
    userRole?: string;
}

export default function ProfileDropdown({ userName, userEmail, userRole }: ProfileDropdownProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        const result = await logoutAction();

        if (result.success) {
            // Redirect to appropriate login page based on role
            if (userRole === 'vendor') {
                router.push('/vendor/login');
            } else {
                router.push('/login');
            }
            router.refresh();
        }
        setLoggingOut(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.profile-dropdown')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const getRoleIcon = () => {
        if (userRole === 'vendor') return <Store className="w-4 h-4" />;
        return <ShoppingBag className="w-4 h-4" />;
    };

    const getRoleBadge = () => {
        if (userRole === 'vendor') return 'Vendor';
        if (userRole === 'admin') return 'Admin';
        return 'Customer';
    };

    return (
        <div className="relative profile-dropdown">
            {/* Profile Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all border border-white/20"
            >
                <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-gray-900">{userName || 'User'}</p>
                    <p className="text-xs text-gray-600">{getRoleBadge()}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-700 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">{userName || 'User'}</p>
                                <p className="text-xs text-gray-600 truncate">{userEmail || 'user@example.com'}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    {getRoleIcon()}
                                    <span className="text-xs font-medium text-brand-600">{getRoleBadge()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                        {userRole === 'vendor' && (
                            <button
                                onClick={() => {
                                    router.push('/vendor/dashboard');
                                    setIsOpen(false);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                            >
                                <Store className="w-4 h-4 text-gray-500" />
                                <span>Vendor Dashboard</span>
                            </button>
                        )}

                        <button
                            onClick={() => {
                                // TODO: Navigate to settings page
                                setIsOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                        >
                            <Settings className="w-4 h-4 text-gray-500" />
                            <span>Settings</span>
                        </button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 py-1">
                        <button
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
