import { create } from 'zustand';

export type AlertSeverity = 'critical' | 'warning' | 'info' | 'success';

export interface Alert {
    id: string;
    severity: AlertSeverity;
    title: string;
    message: string;
    robotId?: string;
    timestamp: Date;
    read: boolean;
}

interface AlertState {
    alerts: Alert[];
    addAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'read'>) => void;
    dismissAlert: (id: string) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearAll: () => void;
    unreadCount: () => number;
}

export const useAlertStore = create<AlertState>((set, get) => ({
    alerts: [
        {
            id: '1',
            severity: 'critical',
            title: 'High Turbidity Detected',
            message: 'Sector B shows turbidity above safe limits (85 NTU). Immediate inspection recommended.',
            robotId: '1',
            timestamp: new Date(),
            read: false,
        },
        {
            id: '2',
            severity: 'warning',
            title: 'Battery Low',
            message: 'HY-BOT-02 battery at 12%. Auto-returning to charging station.',
            robotId: '2',
            timestamp: new Date(Date.now() - 3600000),
            read: false,
        },
        {
            id: '3',
            severity: 'info',
            title: 'Mission Complete',
            message: 'HY-BOT-01 finished trash collection in Sector A. 4.2 km covered.',
            robotId: '1',
            timestamp: new Date(Date.now() - 7200000),
            read: true,
        },
        {
            id: '4',
            severity: 'success',
            title: 'Calibration Done',
            message: 'pH sensor on HY-BOT-01 calibrated successfully.',
            robotId: '1',
            timestamp: new Date(Date.now() - 86400000),
            read: true,
        },
        {
            id: '5',
            severity: 'warning',
            title: 'Signal Weak',
            message: 'HY-BOT-02 signal strength below 40% in Sector C.',
            robotId: '2',
            timestamp: new Date(Date.now() - 90000000),
            read: true,
        },
        {
            id: '6',
            severity: 'critical',
            title: 'Sensor Failure',
            message: 'TDS sensor on HY-BOT-02 reporting anomalous readings. Check hardware.',
            robotId: '2',
            timestamp: new Date(Date.now() - 172800000),
            read: true,
        },
    ],

    addAlert: (alert) => set((state) => ({
        alerts: [{
            ...alert,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date(),
            read: false,
        }, ...state.alerts],
    })),

    dismissAlert: (id) => set((state) => ({
        alerts: state.alerts.filter(a => a.id !== id),
    })),

    markAsRead: (id) => set((state) => ({
        alerts: state.alerts.map(a => a.id === id ? { ...a, read: true } : a),
    })),

    markAllAsRead: () => set((state) => ({
        alerts: state.alerts.map(a => ({ ...a, read: true })),
    })),

    clearAll: () => set({ alerts: [] }),

    unreadCount: () => get().alerts.filter(a => !a.read).length,
}));
