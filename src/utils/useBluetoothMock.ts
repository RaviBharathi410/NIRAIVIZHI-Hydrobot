import { useState, useEffect, useCallback } from 'react';

interface Device {
    id: string;
    name: string;
    rssi: number;
}

interface SensorData {
    tds: number;
    ph: number;
    turbidity: number;
    temperature: number;
    dissolvedOxygen: number;
    timestamp: string;
}

export function useBluetoothMock() {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const [sensorData, setSensorData] = useState<SensorData | null>(null);
    const [devices, setDevices] = useState<Device[]>([]);

    const generateData = useCallback((): SensorData => ({
        tds: Math.floor(Math.random() * 600) + 50,
        ph: parseFloat((Math.random() * 6 + 4).toFixed(1)),
        turbidity: parseFloat((Math.random() * 10).toFixed(2)),
        temperature: parseFloat((Math.random() * 15 + 20).toFixed(1)),
        dissolvedOxygen: parseFloat((Math.random() * 5 + 5).toFixed(1)),
        timestamp: new Date().toISOString(),
    }), []);

    const scan = useCallback(() => {
        setIsScanning(true);
        setTimeout(() => {
            setDevices([
                { id: 'AG-SENSOR-001', name: 'AquaGuard TDS Sensor', rssi: -45 },
                { id: 'AG-SENSOR-002', name: 'AquaGuard pH Sensor', rssi: -52 },
                { id: 'AG-SENSOR-003', name: 'AquaGuard Turbidity Sensor', rssi: -60 },
            ]);
            setIsScanning(false);
        }, 2000);
    }, []);

    const connect = useCallback((deviceId: string) => {
        setIsConnected(true);
        setSensorData(generateData());
    }, [generateData]);

    const disconnect = useCallback(() => {
        setIsConnected(false);
        setSensorData(null);
    }, []);

    useEffect(() => {
        if (!isConnected) return;
        const interval = setInterval(() => {
            setSensorData(generateData());
        }, 3000);
        return () => clearInterval(interval);
    }, [isConnected, generateData]);

    return { isConnected, isScanning, sensorData, devices, scan, connect, disconnect };
}

export default useBluetoothMock;
