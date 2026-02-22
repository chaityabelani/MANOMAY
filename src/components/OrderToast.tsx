'use client';

import { useEffect, useRef } from 'react';

interface OrderToastProps {
    orderId: string;
    shopName?: string;
    onDismiss: () => void;
}

/**
 * onOrderReady(orderId) — call this to trigger the Toast notification.
 * Slides in from top-right, auto-dismisses after 5 seconds.
 */
export default function OrderToast({ orderId, shopName, onDismiss }: OrderToastProps) {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Auto-dismiss after 5 seconds
        timerRef.current = setTimeout(() => {
            onDismiss();
        }, 5000);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [onDismiss]);

    return (
        <>
            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(110%); opacity: 0; }
                    to   { transform: translateX(0);    opacity: 1; }
                }
                @keyframes shrinkWidth {
                    from { width: 100%; }
                    to   { width: 0%;   }
                }
                .toast-card {
                    animation: slideInRight 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }
                .toast-progress {
                    animation: shrinkWidth 5s linear forwards;
                }
            `}</style>

            <div
                role="alert"
                aria-live="assertive"
                className="toast-card fixed top-5 right-5 z-[9999] w-80 rounded-2xl shadow-2xl overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    boxShadow: '0 20px 60px rgba(22, 163, 74, 0.4)',
                }}
            >
                {/* Main content */}
                <div className="px-5 py-4 flex items-start gap-3">
                    {/* Bell icon */}
                    <div
                        className="mt-0.5 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl"
                        style={{ background: 'rgba(255,255,255,0.2)' }}
                    >
                        🔔
                    </div>

                    {/* Message */}
                    <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-base leading-tight">
                            Your order is ready! 🎉
                        </p>
                        {shopName && (
                            <p className="text-green-100 text-sm mt-0.5">{shopName}</p>
                        )}
                        <p className="text-green-200 text-xs mt-1 font-mono truncate">
                            Order #{orderId.slice(-8).toUpperCase()}
                        </p>
                    </div>

                    {/* Dismiss button */}
                    <button
                        onClick={onDismiss}
                        aria-label="Dismiss notification"
                        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors text-lg leading-none"
                    >
                        ✕
                    </button>
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-white/20">
                    <div
                        ref={progressRef}
                        className="toast-progress h-full bg-white/70 rounded-full"
                    />
                </div>
            </div>
        </>
    );
}
