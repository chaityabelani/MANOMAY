'use client';

import { useState, useEffect } from 'react';
import { X, User } from 'lucide-react';

/**
 * UserNotification Component
 * 
 * A toast-style notification component that displays a welcome message
 * to the user. Replaces the static "Hi, Customer" text with an 
 * interactive notification badge.
 * 
 * Features:
 * - Auto-shows on component mount
 * - Dismissible by user
 * - Can be manually triggered
 * - Accessible with ARIA attributes
 */

interface UserNotificationProps {
    userName: string;
    message?: string;
}

export default function UserNotification({
    userName,
    message = 'Welcome back!'
}: UserNotificationProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Trigger entrance animation
        setIsAnimating(true);
    }, []);

    const handleDismiss = () => {
        setIsAnimating(false);
        setTimeout(() => setIsVisible(false), 300);
    };

    if (!isVisible) return null;

    return (
        <div
            role="alert"
            aria-live="polite"
            aria-atomic="true"
            className={`
                flex items-center gap-3 px-4 py-2 
                bg-gradient-to-r from-orange-50 to-pink-50 
                border border-orange-200 rounded-full
                shadow-sm hover:shadow-md transition-all duration-300
                ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
            `}
        >
            {/* User Icon */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
            </div>

            {/* Message Content */}
            <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-orange-800">
                    {message}
                </span>
                <span className="text-sm font-bold text-slate-900 truncate">
                    {userName}
                </span>
            </div>

            {/* Dismiss Button */}
            <button
                onClick={handleDismiss}
                aria-label="Dismiss notification"
                className="
                    flex-shrink-0 p-1 rounded-full
                    hover:bg-orange-100 transition-colors
                    text-slate-400 hover:text-slate-600
                "
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
