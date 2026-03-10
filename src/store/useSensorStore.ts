import { create } from 'zustand';

export interface SensorThresholds {
    caution: number;
    critical: number;
}

export interface SensorConfig {
    type: 'ph' | 'turbidity' | 'temperature' | 'tds';
    label: string;
    unit: string;
    color: string;
    thresholds: SensorThresholds;
}

interface SensorState {
    selectedTimeRange: '1H' | '6H' | '24H' | '7D';
    sensors: Record<string, SensorConfig>;
    setTimeRange: (range: '1H' | '6H' | '24H' | '7D') => void;
    setThresholds: (sensorType: string, thresholds: SensorThresholds) => void;
    chartRefreshRate: number;
    setChartRefreshRate: (rate: number) => void;
}

export const useSensorStore = create<SensorState>((set) => ({
    selectedTimeRange: '24H',

    sensors: {
        ph: {
            type: 'ph',
            label: 'pH Level',
            unit: 'pH',
            color: '#00E5FF',
            thresholds: { caution: 8.0, critical: 8.5 },
        },
        turbidity: {
            type: 'turbidity',
            label: 'Turbidity',
            unit: 'NTU',
            color: '#F59E0B',
            thresholds: { caution: 60, critical: 85 },
        },
        temperature: {
            type: 'temperature',
            label: 'Temperature',
            unit: '°C',
            color: '#EF4444',
            thresholds: { caution: 32, critical: 38 },
        },
        tds: {
            type: 'tds',
            label: 'TDS',
            unit: 'ppm',
            color: '#06B6D4',
            thresholds: { caution: 350, critical: 500 },
        },
    },

    chartRefreshRate: 1000, // Default 1s

    setTimeRange: (range) => set({ selectedTimeRange: range }),

    setThresholds: (sensorType, thresholds) => set((state) => ({
        sensors: {
            ...state.sensors,
            [sensorType]: {
                ...state.sensors[sensorType],
                thresholds,
            },
        },
    })),

    setChartRefreshRate: (rate) => set({ chartRefreshRate: rate }),
}));
