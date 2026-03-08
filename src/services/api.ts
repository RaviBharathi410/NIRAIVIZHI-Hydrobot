import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://127.0.0.1:3001',
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface WaterQualityData {
    tds: number;
    ph: number;
    turbidity: number;
    timestamp: string;
}

export interface AlertData {
    id: string;
    type: 'danger' | 'warning' | 'info';
    message: string;
    timestamp: string;
}

export interface RobotData {
    id: string;
    name: string;
    status: 'active' | 'charging' | 'idle' | 'error';
    battery: number;
    lat: number;
    lng: number;
}

const apiService = {
    getWaterQuality: async (): Promise<WaterQualityData[]> => {
        const response = await api.get('/api/water-quality');
        return response.data;
    },
    getAlerts: async (): Promise<AlertData[]> => {
        const response = await api.get('/api/alerts');
        return response.data;
    },
    getBotFleet: async (): Promise<RobotData[]> => {
        const response = await api.get('/api/robots');
        return response.data;
    },
    login: async (email: string, password: string): Promise<any> => {
        const response = await api.post('/api/login', { email, password });
        return response.data;
    }
};

export default apiService;
