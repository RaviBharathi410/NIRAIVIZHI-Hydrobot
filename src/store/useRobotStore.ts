import { create } from 'zustand';

export type ConnectionStatus = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'ERROR';

export interface Detection {
    id: string;
    robotId: string;
    type: 'PLASTIC' | 'ORGANIC' | 'METAL' | 'CHEMICAL' | string;
    confidence: number;
    location: { latitude: number; longitude: number };
    timestamp: Date;
    box?: { x: number; y: number; w: number; h: number };
}


export interface Robot {
    id: string;
    name: string;
    status: 'ONLINE' | 'OFFLINE' | 'CHARGING' | 'ERROR';
    battery: number;
    lastSeen: Date;
    telemetry: {
        ph: number;
        turbidity: number;
        temp: number;
        tds: number;
        location: { latitude: number; longitude: number };
        gasLevels?: {
            methane: number;
            co2: number;
            ammonia: number;
            sulfide: number;
        };
        floodRisk?: {
            index: number;
            waterLevel: number;
            flowRate: number;
        };
        conveyors?: {
            belt1: number;
            belt2: number;
        };
        valves?: Array<{
            id: number;
            name: string;
            status: boolean;
            flow: number;
        }>;
        speed: number;

        heading: number;
        voltage: number;
        pollutionIndex?: number;
    };
    path: { latitude: number; longitude: number }[];
    history: any[];
}

interface MissionStats {
    totalDistance: number;
    totalTrash: number;
    totalTime: number; // in seconds
}

interface RobotState {
    robots: Robot[];
    detections: Detection[];
    missionStats: MissionStats;
    selectedRobotId: string | null;
    isLoading: boolean;
    connectionStatus: ConnectionStatus;
    missions: Array<{ id: string; date: string; area: string; trash: number; duration: string }>;
    aiPerformance: {
        fps: number;
        latency: number;
    };
    setRobots: (robots: Robot[]) => void;

    setSelectedRobot: (id: string | null) => void;
    updateRobotTelemetry: (id: string, data: Partial<Robot> | { telemetry: Partial<Robot['telemetry']> }) => void;
    fetchRobotHistory: (id: string) => Promise<void>;
    addDetection: (detection: Detection) => void;
    setMissions: (missions: Array<{ id: string; date: string; area: string; trash: number; duration: string }>) => void;
    setConveyorSpeed: (robotId: string, belt: 1 | 2, speed: number) => void;
    toggleValve: (robotId: string, valveId: number) => void;
    setConnectionStatus: (status: ConnectionStatus) => void;
    toggleStatus: (id: string) => void;
    updateMissionStats: (stats: Partial<MissionStats>) => void;
    updateAiPerformance: (perf: Partial<RobotState['aiPerformance']>) => void;
}

export const useRobotStore = create<RobotState>((set) => ({
    robots: [],
    detections: [],
    missionStats: {
        totalDistance: 12.4,
        totalTrash: 48,
        totalTime: 18450, // ~5.1 hours
    },
    selectedRobotId: '1',
    isLoading: false,
    connectionStatus: 'DISCONNECTED',
    missions: [
        { id: 'MS-2024-001', date: '2024-03-10', area: 'Sector A-1', trash: 12.4, duration: '2h 15m' },
        { id: 'MS-2024-002', date: '2024-03-09', area: 'Main Canal', trash: 8.2, duration: '1h 45m' },
        { id: 'MS-2024-003', date: '2024-03-08', area: 'Sector B-4', trash: 15.1, duration: '3h 10m' },
    ],
    aiPerformance: {
        fps: 30,
        latency: 5,
    },


    updateMissionStats: (newStats) => set((state) => ({
        missionStats: { ...state.missionStats, ...newStats }
    })),


    setRobots: (robots) => set({
        robots: robots.map(r => ({ ...r, history: r.history || [], path: r.path || [] }))
    }),
    setSelectedRobot: (id) => set({ selectedRobotId: id }),

    setConnectionStatus: (status) => set({ connectionStatus: status }),

    addDetection: (detection) => set((state) => ({
        detections: [detection, ...state.detections].slice(0, 50) // Keep last 50
    })),

    updateRobotTelemetry: (id, data) => set((state) => {
        const robots = state.robots.map(r => {
            if (r.id === id) {
                const isNestedUpdate = 'telemetry' in data;
                const telemetryUpdate = isNestedUpdate ? data.telemetry : {};
                const topLevelUpdate = isNestedUpdate ? { ...data } : {};
                if (isNestedUpdate) delete (topLevelUpdate as any).telemetry;

                const newData = isNestedUpdate ? data.telemetry : data;
                const newLocation = (newData as any).location;

                const updatedRobot: Robot = {
                    ...r,
                    ...(topLevelUpdate as any),
                    telemetry: {
                        ...r.telemetry,
                        ...(telemetryUpdate as any)
                    },
                    lastSeen: new Date()
                };

                if (newLocation) {
                    updatedRobot.path = [...(r.path || []), newLocation].slice(-100);
                }

                return updatedRobot;
            }
            return r;
        });
        return { robots };
    }),

    toggleStatus: (id) => set((state) => ({
        robots: state.robots.map(r => r.id === id ? { ...r, status: r.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE' } : r)
    })),

    fetchRobotHistory: async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/api/robot/${id}/history`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            set((state) => ({
                robots: state.robots.map(r => r.id === id ? { ...r, history: data } : r)
            }));
        } catch (error) {
            console.error('History Fetch Failed:', error);
            set((state) => ({
                robots: state.robots.map(r => r.id === id ? { ...r, history: [] } : r)
            }));
        }
    },

    setMissions: (missions) => set({ missions }),

    setConveyorSpeed: (robotId, belt, speed) => set((state) => ({

        robots: state.robots.map((r) => {
            if (r.id !== robotId) return r;
            const conveyors = { ...(r.telemetry.conveyors || { belt1: 0, belt2: 0 }) };
            if (belt === 1) conveyors.belt1 = speed;
            else conveyors.belt2 = speed;

            console.log(`[RobotStore] Setting Conveyor ${belt} speed to ${speed}% for robot ${robotId}`);
            return {
                ...r,
                telemetry: { ...r.telemetry, conveyors }
            };
        })
    })),

    toggleValve: (robotId, valveId) => set((state) => ({
        robots: state.robots.map((r) => {
            if (r.id !== robotId) return r;
            const valves = (r.telemetry.valves || []).map((v) => {
                if (v.id !== valveId) return v;
                const newStatus = !v.status;
                return { ...v, status: newStatus, flow: newStatus ? 80 : 0 };
            });

            console.log(`[RobotStore] Toggling Valve ${valveId} for robot ${robotId}`);
            return {
                ...r,
                telemetry: { ...r.telemetry, valves }
            };
        })
    })),
    updateAiPerformance: (perf) => set((state) => ({
        aiPerformance: { ...state.aiPerformance, ...perf }
    })),
}));


// Initialize with professional mock data
useRobotStore.getState().setRobots([
    {
        id: '1',
        name: 'HY-BOT-01 (Mani)',
        status: 'ONLINE',
        battery: 84,
        lastSeen: new Date(),
        telemetry: {
            speed: 1.2,
            heading: 45,
            voltage: 12.4,
            temp: 24,
            ph: 7.2,
            turbidity: 4.5,
            tds: 145,
            location: { latitude: 12.9716, longitude: 77.5946 },
            pollutionIndex: 42,
            gasLevels: { methane: 12, co2: 420, ammonia: 5, sulfide: 2 },
            floodRisk: { index: 25, waterLevel: 4.2, flowRate: 128 },
            conveyors: { belt1: 65, belt2: 40 },
            valves: [
                { id: 1, name: 'Main Intake', status: true, flow: 85 },
                { id: 2, name: 'Filtration Bypass', status: false, flow: 0 },
                { id: 3, name: 'Chemical Injector', status: false, flow: 0 },
                { id: 4, name: 'Effluent Release', status: true, flow: 60 },
            ]
        },
        path: [],

        history: []
    },
    {
        id: '2',
        name: 'Bumblebee',
        status: 'ONLINE',
        battery: 62,
        lastSeen: new Date(),
        telemetry: {
            speed: 0.8,
            heading: 90,
            voltage: 12.1,
            temp: 22,
            ph: 6.8,
            turbidity: 12.2,
            tds: 210,
            location: { latitude: 12.9720, longitude: 77.5950 },
            pollutionIndex: 30,
            gasLevels: { methane: 18, co2: 450, ammonia: 8, sulfide: 3 },
            floodRisk: { index: 45, waterLevel: 5.1, flowRate: 145 }
        },
        path: [],
        history: []
    },
    {
        id: '3',
        name: 'HY-BOT-02 (Ravi)',
        status: 'CHARGING',
        battery: 12,
        lastSeen: new Date(Date.now() - 3600000),
        telemetry: {
            speed: 0,
            heading: 0,
            voltage: 11.2,
            temp: 30.1,
            ph: 7.0,
            turbidity: 12,
            tds: 210,
            location: { latitude: 12.9816, longitude: 77.6046 },
            pollutionIndex: 15,
            gasLevels: { methane: 5, co2: 380, ammonia: 2, sulfide: 1 },
            floodRisk: { index: 10, waterLevel: 3.0, flowRate: 80 }
        },
        path: [],
        history: []
    }
]);
