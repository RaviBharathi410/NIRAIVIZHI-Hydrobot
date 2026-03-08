import { io, Socket } from 'socket.io-client';
import { Platform } from 'react-native';

const SOCKET_URL = Platform.OS === 'web' ? 'http://localhost:3001' : 'http://10.0.2.2:3001';

class TelemetryService {
    private socket: Socket | null = null;
    private listeners: Set<(data: any) => void> = new Set();

    connect() {
        if (this.socket) return;

        this.socket = io(SOCKET_URL);

        this.socket.on('connect', () => {
            console.log('Connected to Aquaguard Backend');
        });

        this.socket.on('telemetry', (data: any) => {
            this.listeners.forEach(listener => listener(data));
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from Aquaguard Backend');
        });
    }

    subscribe(callback: (data: any) => void) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

const telemetryService = new TelemetryService();
export default telemetryService;
