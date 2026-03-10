import { create } from 'zustand';

export type ThemeMode = 'dark' | 'light';
export type SessionTimeout = 900000 | 1800000 | 3600000 | 0; // 15m, 30m, 1h, Never
export type MapStyle = 'satellite' | 'standard' | 'dark';

interface SettingsState {
    // Connection
    wsUrl: string;
    mqttBroker: string;

    // Notifications
    batteryLowAlert: boolean;
    obstacleAlert: boolean;
    sensorFailureAlert: boolean;
    missionCompleteAlert: boolean;

    // Display
    themeMode: ThemeMode;
    chartRefreshRate: number; // ms
    mapStyle: MapStyle;

    // Security
    biometricLock: boolean;
    sessionTimeout: SessionTimeout;

    // Actions
    setWsUrl: (url: string) => void;
    setMqttBroker: (broker: string) => void;
    toggleNotification: (key: 'batteryLowAlert' | 'obstacleAlert' | 'sensorFailureAlert' | 'missionCompleteAlert') => void;
    setThemeMode: (mode: ThemeMode) => void;
    setChartRefreshRate: (rate: number) => void;
    setMapStyle: (style: MapStyle) => void;
    setBiometricLock: (enabled: boolean) => void;
    setSessionTimeout: (timeout: SessionTimeout) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
    // Connection defaults
    wsUrl: 'ws://192.168.1.100:3001',
    mqttBroker: 'mqtt://192.168.1.100:1883',

    // Notifications — all enabled by default
    batteryLowAlert: true,
    obstacleAlert: true,
    sensorFailureAlert: true,
    missionCompleteAlert: true,

    // Display defaults
    themeMode: 'dark',
    chartRefreshRate: 1000,
    mapStyle: 'satellite',

    // Security defaults
    biometricLock: false,
    sessionTimeout: 1800000, // 30 min

    // Actions
    setWsUrl: (url) => set({ wsUrl: url }),
    setMqttBroker: (broker) => set({ mqttBroker: broker }),

    toggleNotification: (key) => set((state) => ({
        [key]: !state[key],
    })),

    setThemeMode: (mode) => set({ themeMode: mode }),
    setChartRefreshRate: (rate) => set({ chartRefreshRate: rate }),
    setMapStyle: (style) => set({ mapStyle: style }),
    setBiometricLock: (enabled) => set({ biometricLock: enabled }),
    setSessionTimeout: (timeout) => set({ sessionTimeout: timeout }),
}));
