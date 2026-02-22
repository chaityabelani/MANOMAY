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

export function useOrderNotification() {
    return useContext(NotificationContext);
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function OrderNotificationProvider({ children }: { children: React.ReactNode }) {
    const [toast, setToast] = useState<ToastData | null>(null);
    // Phone is stored in localStorage at checkout — works for guests AND logged-in users
    const [customerPhone, setCustomerPhone] = useState<string | null>(null);
    const prevStatuses = useRef<Record<string, string>>({});
    const seeded = useRef(false);

    // Read phone from localStorage on mount (client-side only)
    useEffect(() => {
        const phone = localStorage.getItem('manomay_customer_phone');
        if (phone) setCustomerPhone(phone);
    }, []);

    const onOrderReady = useCallback((orderId: string, shopName = 'your shop') => {
        setToast({ orderId, shopName });
    }, []);

    // Poll every 10 seconds when we have a phone number
    useSWR<{ orders: OrderStatus[] }>(
        customerPhone
            ? `/api/customer/order-status?phone=${encodeURIComponent(customerPhone)}`
            : null,
        fetcher,
        {
            refreshInterval: 10000,
            revalidateOnFocus: true,
            onSuccess(data) {
                if (!data?.orders) return;

                // First load: seed statuses silently (don't fire for already-ready orders)
                if (!seeded.current) {
                    data.orders.forEach(({ id, status }) => {
                        prevStatuses.current[id] = status;
                    });
                    seeded.current = true;
                    return;
                }

                // Subsequent polls: fire Toast only on → ready transitions
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
