import { io, Socket } from 'socket.io-client';
import { useRobotStore } from '../store/useRobotStore';

const SOCKET_URL = 'http://localhost:3001'; // Should be in env in production

class SocketService {
    private socket: Socket | null = null;

    connect() {
        if (this.socket?.connected) return;

        this.socket = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnectionAttempts: 3,
            reconnectionDelay: 3000,
            timeout: 5000,
        });

        const store = useRobotStore.getState();

        this.socket.on('connect', () => {
            console.log('Connected to Technical Bridge');
            store.setConnectionStatus('CONNECTED');
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from Bridge');
            store.setConnectionStatus('DISCONNECTED');
        });

        this.socket.on('connect_error', (error) => {
            console.warn('[Socket] Backend offline — operating in offline mode:', error.message);
            store.setConnectionStatus('ERROR');
        });

        // Listen for live telemetry
        this.socket.on('telemetry', (data: any) => {
            const { robotId, telemetry, ...topLevel } = data;
            // Map incoming server data to our store
            store.updateRobotTelemetry(robotId || '1', {
                ...topLevel,
                telemetry: telemetry || data, // Handle flat or nested telemetry
            });
        });

        // Listen for system alerts
        this.socket.on('alert', (alert: any) => {
            console.log('ALERT RECEIVED:', alert);
            // Route to alert store for live display
            try {
                const { useAlertStore } = require('../store/useAlertStore');
                useAlertStore.getState().addAlert({
                    severity: alert.severity || 'info',
                    title: alert.title || 'System Alert',
                    message: alert.message || '',
                    robotId: alert.robotId,
                });
            } catch (e) {
                console.warn('Alert store not available:', e);
            }
        });

        // Listen for AI detections
        this.socket.on('detection', (data: any) => {
            store.addDetection({
                ...data,
                id: Math.random().toString(36).substr(2, 9),
                timestamp: new Date(data.timestamp),
            });
        });
    }

    sendRobotCommand(robotId: string, command: any) {
        if (this.socket?.connected) {
            this.socket.emit('robot_command', { robotId, ...command });
        }
    }


    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export const socketService = new SocketService();
