import { Alert, Platform } from 'react-native';
import { COLORS } from '../constants/theme';

export type WaterStatus = 'safe' | 'moderate' | 'unsafe' | 'unknown';
export type BatteryStatus = 'critical' | 'low' | 'moderate' | 'good';

interface ThresholdRange {
    safe: [number, number];
    moderate: [number, number];
    unsafe: [number, number];
}

const THRESHOLDS: Record<string, ThresholdRange | { critical: number; low: number; ok: number }> = {
    tds: { safe: [0, 300], moderate: [300, 500], unsafe: [500, Infinity] } as any,
    ph: { safe: [6.5, 8.5], moderate: [5.5, 9.5], unsafe: [0, 14] } as any,
    turbidity: { safe: [0, 1], moderate: [1, 4], unsafe: [4, Infinity] } as any,
    battery: { critical: 10, low: 25, ok: 50 },
};

export const AlertSystem = {
    getWaterStatus(type: 'tds' | 'ph' | 'turbidity', value: string | number): WaterStatus {
        const range = THRESHOLDS[type] as ThresholdRange;
        if (!range) return 'unknown';
        const num = typeof value === 'string' ? parseFloat(value) : value;

        if (type === 'ph') {
            if (num >= range.safe[0] && num <= range.safe[1]) return 'safe';
            if (num >= range.moderate[0] && num <= range.moderate[1]) return 'moderate';
            return 'unsafe';
        }
        if (num <= range.safe[1]) return 'safe';
        if (num <= range.moderate[1]) return 'moderate';
        return 'unsafe';
    },

    getStatusColor(status: WaterStatus): string {
        switch (status) {
            case 'safe': return COLORS.success;
            case 'moderate': return COLORS.warning;
            case 'unsafe': return COLORS.danger;
            default: return COLORS.textMuted;
        }
    },

    getBatteryStatus(level: number): BatteryStatus {
        const batteryRanges = THRESHOLDS.battery as { critical: number; low: number; ok: number };
        if (level <= batteryRanges.critical) return 'critical';
        if (level <= batteryRanges.low) return 'low';
        if (level <= batteryRanges.ok) return 'moderate';
        return 'good';
    },

    showAlert(title: string, message: string, type: 'info' | 'warning' | 'danger' = 'info') {
        if (Platform.OS === 'web') {
            console.log(`[ALERT - ${type.toUpperCase()}] ${title}: ${message}`);
            window.alert(`${title}\n\n${message}`);
        } else {
            Alert.alert(title, message, [{ text: 'OK' }]);
        }
    },

    checkAndAlert(sensorData: { tds?: number; ph?: number; turbidity?: number }) {
        const alerts: { type: string; message: string }[] = [];
        if (sensorData.tds !== undefined) {
            const status = this.getWaterStatus('tds', sensorData.tds);
            if (status === 'unsafe') alerts.push({ type: 'danger', message: `TDS level critical: ${sensorData.tds} ppm` });
            else if (status === 'moderate') alerts.push({ type: 'warning', message: `TDS level elevated: ${sensorData.tds} ppm` });
        }
        if (sensorData.ph !== undefined) {
            const status = this.getWaterStatus('ph', sensorData.ph);
            if (status === 'unsafe') alerts.push({ type: 'danger', message: `pH level critical: ${sensorData.ph}` });
            else if (status === 'moderate') alerts.push({ type: 'warning', message: `pH level outside normal: ${sensorData.ph}` });
        }
        if (sensorData.turbidity !== undefined) {
            const status = this.getWaterStatus('turbidity', sensorData.turbidity);
            if (status === 'unsafe') alerts.push({ type: 'danger', message: `High turbidity detected: ${sensorData.turbidity} NTU` });
        }
        return alerts;
    },
};

export default AlertSystem;
