import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, FONTS, SPACE } from '../constants/theme';
import telemetryService from '../services/telemetryService';
import StatusCard from './StatusCard';
import AlertSystem from '../services/AlertSystem';

export default function WaterQualityHUD() {
    const [data, setData] = useState({
        ph: '--',
        tds: '--',
        turbidity: '--',
        temp: '--',
        timestamp: null as string | null
    });

    const [connected, setConnected] = useState(false);

    useEffect(() => {
        telemetryService.connect();
        setConnected(true);

        const unsubscribe = telemetryService.subscribe((newData: any) => {
            setData(newData);
        });

        return () => {
            unsubscribe();
            telemetryService.disconnect();
        };
    }, []);

    const getStatus = (type: string, val: string): 'safe' | 'moderate' | 'unsafe' | 'default' => {
        if (val === '--') return 'default';
        return AlertSystem.getWaterStatus(type as 'ph' | 'tds' | 'turbidity', parseFloat(val)) as 'safe' | 'moderate' | 'unsafe' | 'default';
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={[styles.pulse, { backgroundColor: connected ? COLORS.success : COLORS.danger }]} />
                <Text style={styles.liveText}>{connected ? 'LIVE TELEMETRY' : 'DISCONNECTED'}</Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
            >
                <StatusCard
                    title="pH LEVEL"
                    value={data.ph}
                    unit="pH"
                    status={getStatus('ph', data.ph)}
                    icon="🧪"
                />
                <StatusCard
                    title="TDS SENSOR"
                    value={data.tds}
                    unit="ppm"
                    status={getStatus('tds', data.tds)}
                    icon="💧"
                />
                <StatusCard
                    title="TURBIDITY"
                    value={data.turbidity}
                    unit="NTU"
                    status={getStatus('turbidity', data.turbidity)}
                    icon="🌊"
                />
                <StatusCard
                    title="TEMPERATURE"
                    value={data.temp}
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
