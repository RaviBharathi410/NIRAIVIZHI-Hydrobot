import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, FONTS, SPACE } from '../constants/theme';
import { useRobotStore } from '../store/useRobotStore';
import StatusCard from './StatusCard';

export default function WaterQualityHUD() {
    const { robots, selectedRobotId, connectionStatus } = useRobotStore();
    const robot = robots.find(r => r.id === selectedRobotId) || robots[0];

    const isConnected = connectionStatus === 'CONNECTED' && robot?.status === 'ONLINE';

    const getStatus = (type: 'ph' | 'tds' | 'turbid' | string, val: any): 'safe' | 'moderate' | 'unsafe' | 'default' => {
        if (val === undefined || val === null || val === '--') return 'default';
        const num = parseFloat(val);

        // Simple logic mirroring AlertSystem but integrated
        if (type === 'ph') {
            if (num >= 6.5 && num <= 8.5) return 'safe';
            if (num < 6.0 || num > 9.0) return 'unsafe';
            return 'moderate';
        }
        if (type === 'tds') {
            if (num < 300) return 'safe';
            if (num > 600) return 'unsafe';
            return 'moderate';
        }
        if (type === 'turbid') {
            if (num < 5) return 'safe';
            if (num > 15) return 'unsafe';
            return 'moderate';
        }
        return 'default';
    };

    const telemetry = robot?.telemetry || { ph: 0, tds: 0, turbidity: 0, temp: 0 };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={[styles.pulse, { backgroundColor: isConnected ? COLORS.success : COLORS.danger }]} />
                <Text style={styles.liveText}>{isConnected ? 'LIVE TELEMETRY' : 'OFFLINE / DISCONNECTED'}</Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
            >
                <StatusCard
                    title="pH LEVEL"
                    value={Number(telemetry.ph || 0).toFixed(1)}
                    unit="pH"
                    status={getStatus('ph', telemetry.ph)}
                    icon="🧪"
                />
                <StatusCard
                    title="TDS SENSOR"
                    value={Number(telemetry.tds || 0).toString()}
                    unit="ppm"
                    status={getStatus('tds', telemetry.tds)}
                    icon="💧"
                />
                <StatusCard
                    title="TURBIDITY"
                    value={Number(telemetry.turbidity || 0).toString()}
                    unit="NTU"
                    status={getStatus('turbid', telemetry.turbidity)}
                    icon="🌊"
                />
                <StatusCard
                    title="TEMPERATURE"
                    value={Number(telemetry.temp || 0).toFixed(1)}
                    unit="°C"
                    status="info"
                    icon="🌡️"
                />
            </ScrollView>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: SPACE[2],
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACE[3],
        paddingLeft: 4,
    },
    pulse: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 8,
    },
    liveText: {
        ...FONTS.bold,
        fontSize: 10,
        color: COLORS.textMuted,
        letterSpacing: 2,
    },
    scroll: {
        paddingRight: 40,
    }
});
