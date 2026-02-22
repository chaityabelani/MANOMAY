'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';
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
    /** Call this to manually fire the "order ready" toast */
    onOrderReady: (orderId: string, shopName?: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
    onOrderReady: () => { },
});

export function useOrderNotification() {
    return useContext(NotificationContext);
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface Props {
    children: React.ReactNode;
    /** Customer's userId from JWT session — used to query their orders */
    userId?: string;
}

/**
 * Wraps customer pages. Polls /api/customer/order-status every 10s.
 * When any order transitions to "ready", fires the OrderToast.
 * Exposes onOrderReady(orderId) for manual triggering.
 */
export default function OrderNotificationProvider({ children, userId }: Props) {
    const [toast, setToast] = useState<ToastData | null>(null);
    // Track previously-seen statuses so we only fire on *transitions* → ready
    const prevStatuses = useRef<Record<string, string>>({});
    const seeded = useRef(false);

    /** Programmatic trigger — satisfies the `onOrderReady(orderId)` requirement */
    const onOrderReady = useCallback((orderId: string, shopName = 'your shop') => {
        setToast({ orderId, shopName });
    }, []);

    // Poll every 10 seconds when a userId is available
    useSWR<{ orders: OrderStatus[] }>(
        userId ? `/api/customer/order-status?userId=${encodeURIComponent(userId)}` : null,
        fetcher,
        {
            refreshInterval: 10000,
            revalidateOnFocus: true,
            onSuccess(data) {
                if (!data?.orders) return;

                // On first load, seed statuses without firing toasts
                if (!seeded.current) {
                    data.orders.forEach(({ id, status }) => {
                        prevStatuses.current[id] = status;
                    });
                    seeded.current = true;
                    return;
                }

                // On subsequent polls, detect ready transitions
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

            {/* Toast overlay — fixed position, outside all scroll containers */}
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
