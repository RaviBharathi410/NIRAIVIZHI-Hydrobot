import { create } from 'zustand';

export type ConnectionStatus = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'ERROR';

export interface Detection {
    id: string;
    robotId: string;
    type: 'PLASTIC' | 'ORGANIC' | 'METAL' | 'CHEMICAL';
    confidence: number;
    location: { latitude: number; longitude: number };
    timestamp: Date;
}

export interface Robot {
    id: string;
    name: string;
    isOnline: boolean;
    battery: number;
    missionStatus: string;
    lastSeen: Date;
    location: { latitude: number; longitude: number };
    telemetry: {
        speed: number;
        heading: number;
        voltage: number;
        temp: number;
        ph: number;
        turbidity: number;
        tds: number;
        pollutionIndex?: number;
    };
    history: any[];
}

interface RobotState {
    robots: Robot[];
    detections: Detection[];
    selectedRobotId: string | null;
    isLoading: boolean;
    connectionStatus: ConnectionStatus;
    setRobots: (robots: Robot[]) => void;
    setSelectedRobot: (id: string | null) => void;
    updateRobotTelemetry: (id: string, data: Partial<Robot> | { telemetry: Partial<Robot['telemetry']> }) => void;
    fetchRobotHistory: (id: string) => Promise<void>;
    addDetection: (detection: Detection) => void;
    setConnectionStatus: (status: ConnectionStatus) => void;
    toggleStatus: (id: string) => void;
}

export const useRobotStore = create<RobotState>((set) => ({
    robots: [],
    detections: [],
    selectedRobotId: '1',
    isLoading: false,
    connectionStatus: 'DISCONNECTED',

    setRobots: (robots) => set({
        robots: robots.map(r => ({ ...r, history: r.history || [] }))
    }),
    setSelectedRobot: (id) => set({ selectedRobotId: id }),

    setConnectionStatus: (status) => set({ connectionStatus: status }),

    addDetection: (detection) => set((state) => ({
        detections: [detection, ...state.detections].slice(0, 50) // Keep last 50
    })),

    updateRobotTelemetry: (id, data) => set((state) => ({
        robots: state.robots.map(r => {
            if (r.id !== id) return r;

            // Handle nested telemetry updates or top-level field updates
            const updatedRobot = { ...r };
            if ('telemetry' in data) {
                updatedRobot.telemetry = { ...r.telemetry, ...data.telemetry };
            }

            // Merge other top-level fields (battery, missionStatus, etc.)
            Object.assign(updatedRobot, data);
            if ('telemetry' in updatedRobot) delete (updatedRobot as any).telemetry; // Clean up if it was a deep merge

            return {
                ...r,
                ...data,
                telemetry: 'telemetry' in data ? { ...r.telemetry, ...data.telemetry } : r.telemetry,
                lastSeen: new Date(),
            };
        })
    })),

    toggleStatus: (id) => set((state) => ({
        robots: state.robots.map(r => r.id === id ? { ...r, isOnline: !r.isOnline } : r)
    })),

    fetchRobotHistory: async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/api/robot/${id}/history`);
            const data = await response.json();
            set((state) => ({
                robots: state.robots.map(r => r.id === id ? { ...r, history: data } : r)
            }));
        } catch (error) {
            console.error('History Fetch Failed:', error);
        }
    },
}));

// Initialize with professional mock data
useRobotStore.getState().setRobots([
    {
        id: '1',
        name: 'HY-BOT-01 (Mani)',
        isOnline: true,
        battery: 84,
        missionStatus: 'Navigating to Sector A',
        lastSeen: new Date(),
        location: { latitude: 12.9716, longitude: 77.5946 },
        telemetry: { speed: 1.2, heading: 45, voltage: 12.4, temp: 28.5, ph: 7.2, turbidity: 45, tds: 250, pollutionIndex: 42 },
        history: []
    },
    {
        id: '2',
        name: 'HY-BOT-02 (Ravi)',
        isOnline: true,
        battery: 12,
        missionStatus: 'Charging at Station 2',
        lastSeen: new Date(Date.now() - 3600000),
        location: { latitude: 12.9816, longitude: 77.6046 },
        telemetry: { speed: 0, heading: 0, voltage: 11.2, temp: 30.1, ph: 7.0, turbidity: 12, tds: 210, pollutionIndex: 15 },
        history: []
    }
]);
