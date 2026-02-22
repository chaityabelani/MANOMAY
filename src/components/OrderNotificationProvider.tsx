'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import OrderToast from './OrderToast';

interface OrderStatus {
    id: string;
    status: string;
    shopName: string;
}

interface ToastData {
    orderId: string;
    shopName: string;
}

interface NotificationContextType {
    onOrderReady: (orderId: string, shopName?: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
    onOrderReady: () => { },
});

// sessionStorage key — survives component remounts but resets on new browser session
const SEED_KEY = 'manomay_notif_seeded';

export function useOrderNotification() {
    return useContext(NotificationContext);
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function OrderNotificationProvider({ children }: { children: React.ReactNode }) {
    const [toast, setToast] = useState<ToastData | null>(null);
    const [customerPhone, setCustomerPhone] = useState<string | null>(null);

    // prevStatuses persists in ref — survives re-renders but NOT remounts
    // Combined with sessionStorage seed flag this prevents duplicate toasts
    const prevStatuses = useRef<Record<string, string>>({});

    useEffect(() => {
        // Read phone from localStorage (set at checkout for both guest + logged-in)
        const phone = localStorage.getItem('manomay_customer_phone');
        if (phone) setCustomerPhone(phone);

        // Clear seed flag when tab closes so next session starts fresh
        const clearSeed = () => sessionStorage.removeItem(SEED_KEY);
        window.addEventListener('beforeunload', clearSeed);
        return () => window.removeEventListener('beforeunload', clearSeed);
    }, []);

    const onOrderReady = useCallback((orderId: string, shopName = 'your shop') => {
        setToast({ orderId, shopName });
    }, []);

    useSWR<{ orders: OrderStatus[] }>(
        customerPhone
            ? `/api/customer/order-status?phone=${encodeURIComponent(customerPhone)}`
            : null,
        fetcher,
        {
            refreshInterval: 10000,
            revalidateOnFocus: true,
            // Retry up to 3 times on network error, with 5s backoff
            errorRetryCount: 3,
            errorRetryInterval: 5000,
            onError(err) {
                console.error('[OrderNotification] polling error:', err);
            },
            onSuccess(data) {
                if (!data?.orders) return;

                const alreadySeeded = sessionStorage.getItem(SEED_KEY);

                if (!alreadySeeded) {
                    // FIX: Use sessionStorage for seed flag so it survives page
                    // navigation (component remounts) without re-firing old toasts
                    data.orders.forEach(({ id, status }) => {
                        prevStatuses.current[id] = status;
                    });
                    sessionStorage.setItem(SEED_KEY, '1');
                    return;
                }

                // Detect transitions → ready only
                data.orders.forEach(({ id, status, shopName }) => {
                    const prev = prevStatuses.current[id];
                    if (status === 'ready' && prev !== undefined && prev !== 'ready') {
                        onOrderReady(id, shopName);
                    }
                    prevStatuses.current[id] = status;
                });
            },
        }
    );

    return (
        <NotificationContext.Provider value={{ onOrderReady }}>
            {children}
            {toast && (
                <OrderToast
                    orderId={toast.orderId}
                    shopName={toast.shopName}
                    onDismiss={() => setToast(null)}
                />
            )}
        </NotificationContext.Provider>
    );
}
