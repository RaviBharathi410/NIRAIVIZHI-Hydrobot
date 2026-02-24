import { Alert, Platform } from 'react-native';
import { COLORS } from '../constants/theme';

const THRESHOLDS = {
    tds: { safe: [0, 300], moderate: [300, 500], unsafe: [500, Infinity] },
    ph: { safe: [6.5, 8.5], moderate: [5.5, 9.5], unsafe: [0, 14] },
    turbidity: { safe: [0, 1], moderate: [1, 4], unsafe: [4, Infinity] },
    battery: { critical: 10, low: 25, ok: 50 },
};

export const AlertSystem = {
    getWaterStatus(type, value) {
        const range = THRESHOLDS[type];
        if (!range) return 'unknown';
        const num = parseFloat(value);
        if (type === 'ph') {
            if (num >= range.safe[0] && num <= range.safe[1]) return 'safe';
            if (num >= range.moderate[0] && num <= range.moderate[1]) return 'moderate';
            return 'unsafe';
        }
        if (num <= range.safe[1]) return 'safe';
        if (num <= range.moderate[1]) return 'moderate';
        return 'unsafe';
    },

    getStatusColor(status) {
        switch (status) {
            case 'safe': return COLORS.success;
            case 'moderate': return COLORS.warning;
            case 'unsafe': return COLORS.danger;
            default: return COLORS.textMuted;
        }
    },

    getBatteryStatus(level) {
        if (level <= THRESHOLDS.battery.critical) return 'critical';
        if (level <= THRESHOLDS.battery.low) return 'low';
        if (level <= THRESHOLDS.battery.ok) return 'moderate';
        return 'good';
    },

    showAlert(title, message, type = 'info') {
        if (Platform.OS === 'web') {
            console.log(`[ALERT - ${type.toUpperCase()}] ${title}: ${message}`);
            window.alert(`${title}\n\n${message}`);
        } else {
            Alert.alert(title, message, [{ text: 'OK' }]);
        }
    },

    checkAndAlert(sensorData) {
        const alerts = [];
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