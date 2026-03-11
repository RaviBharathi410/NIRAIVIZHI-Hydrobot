import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRobotStore } from '../../store/useRobotStore';
import { useSensorStore } from '../../store/useSensorStore';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme/restyleTheme';
import Text from '../../components/atoms/Text';
import { SensorLineChart } from '../../components/charts/SensorLineChart.native';
import { TimeRangeSelector, TimeRange } from '../../components/charts/TimeRangeSelector';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Button from '../../components/atoms/Button';
import GlassCard from '../../components/GlassCard';
import { RingGauge } from '../../components/RingGauge';
import { calcPollutionIndex, getPollutionSeverity } from '../../utils/pollutionIndex';

export function WaterAnalyticsScreen() {
    const theme = useTheme<Theme>();
    const { robots, selectedRobotId, fetchRobotHistory } = useRobotStore();
    const sensorStore = useSensorStore();
    const [range, setRange] = useState<TimeRange>('24H');

    const robot = robots.find(r => r.id === selectedRobotId) || robots[0];

    // Fetch history on mount or when selection changes
    useEffect(() => {
        if (robot) {
            fetchRobotHistory(robot.id);
        }
    }, [robot?.id, range]);

    // Calculate live pollution index
    const pollutionData = useMemo(() => {
        if (!robot) return { index: 0, severity: getPollutionSeverity(0) };
        const index = calcPollutionIndex({
            ph: Number(robot.telemetry.ph),
            turbidity: Number(robot.telemetry.turbidity),
            temperature: Number(robot.telemetry.temp),
            tds: Number(robot.telemetry.tds),
        });
        return { index, severity: getPollutionSeverity(index) };
    }, [robot]);

    // Extract data for charts from history
    const sensorHistory = useMemo(() => {
        if (!robot?.history || robot.history.length === 0) return { ph: [], tds: [], turbidity: [], temp: [] };

        return {
            ph: robot.history.map((h: any) => ({ timestamp: h.timestamp, value: h.ph })),
            tds: robot.history.map((h: any) => ({ timestamp: h.timestamp, value: h.tds })),
            turbidity: robot.history.map((h: any) => ({ timestamp: h.timestamp, value: h.turbidity })),
            temp: robot.history.map((h: any) => ({ timestamp: h.timestamp, value: h.temp })),
        };
    }, [robot?.history]);

    const phData = sensorHistory.ph;
    const tdsData = sensorHistory.tds;
    const turbidData = sensorHistory.turbidity;
    const tempData = sensorHistory.temp;


    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background as string }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text variant="heading">ANALYTICS</Text>
                        <Text variant="caption">Water Quality History</Text>
                    </View>
                    <TouchableOpacity style={styles.exportBtn}>
                        <MaterialCommunityIcons name="file-export-outline" size={24} color={theme.colors.primary as string} />
                    </TouchableOpacity>
                </View>

                {/* Pollution Index Card */}
                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <GlassCard style={styles.pollutionCard}>
                        <View style={styles.pollutionContent}>
                            <View style={styles.pollutionGauge}>
                                <RingGauge
                                    value={pollutionData.index}
                                    maxValue={100}
                                    size={120}
                                    strokeWidth={12}
                                    color={pollutionData.severity.color}
                                />
                            </View>
                            <View style={styles.pollutionInfo}>
                                <Text variant="caption" style={{ fontWeight: '700', letterSpacing: 1, marginBottom: 4 }}>
                                    POLLUTION INDEX
                                </Text>
                                <View style={[styles.severityPill, { backgroundColor: pollutionData.severity.bgColor }]}>
                                    <View style={[styles.dot, { backgroundColor: pollutionData.severity.color }]} />
                                    <Text variant="body" style={{ color: pollutionData.severity.color, fontWeight: '700' }}>
                                        {pollutionData.severity.label}
                                    </Text>
                                </View>

                                {/* Live sensor values */}
                                <View style={styles.liveSensors}>
                                    <LiveSensorValue label="pH" value={robot ? Number(robot.telemetry.ph).toFixed(1) : '--'} color="#00E5FF" />
                                    <LiveSensorValue label="TDS" value={robot ? String(Math.round(Number(robot.telemetry.tds))) : '--'} unit="ppm" color="#06B6D4" />
                                    <LiveSensorValue label="Turb" value={robot ? String(Math.round(Number(robot.telemetry.turbidity))) : '--'} unit="NTU" color="#F59E0B" />
                                    <LiveSensorValue label="Temp" value={robot ? Number(robot.telemetry.temp).toFixed(1) : '--'} unit="°C" color="#EF4444" />
                                </View>
                            </View>
                        </View>
                    </GlassCard>
                </Animated.View>

                {/* Time Range Selector — sticky */}
                <TimeRangeSelector selected={range} onChange={setRange} />

                {/* Sensor Charts */}
                <View style={styles.chartsContainer}>
                    <Animated.View entering={FadeInDown.delay(300).springify()}>
                        <SensorPanel
                            label="pH Level"
                            currentValue={robot ? Number(robot.telemetry.ph).toFixed(2) : '--'}
                            unit="pH"
                            status={getSensorStatus(Number(robot?.telemetry.ph) || 7, sensorStore.sensors.ph.thresholds)}
                        >
                            <SensorLineChart
                                label="pH Level"
                                data={phData}
                                color="#00E5FF"
                                thresholdLow={6.5}
                                thresholdHigh={8.5}
                            />
                        </SensorPanel>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(400).springify()}>
                        <SensorPanel
                            label="TDS"
                            currentValue={robot?.telemetry.tds?.toString() || '--'}
                            unit="ppm"
                            status={getSensorStatus(Number(robot?.telemetry.tds) || 250, sensorStore.sensors.tds.thresholds)}
                        >
                            <SensorLineChart
                                label="TDS (mg/L)"
                                data={tdsData}
                                color="#06B6D4"
                                thresholdHigh={500}
                            />
                        </SensorPanel>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(500).springify()}>
                        <SensorPanel
                            label="Turbidity"
                            currentValue={robot?.telemetry.turbidity?.toString() || '--'}
                            unit="NTU"
                            status={getSensorStatus(Number(robot?.telemetry.turbidity) || 45, sensorStore.sensors.turbidity.thresholds)}
                        >
                            <SensorLineChart
                                label="Turbidity (NTU)"
                                data={turbidData}
                                color="#F59E0B"
                            />
                        </SensorPanel>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(600).springify()}>
                        <SensorPanel
                            label="Temperature"
                            currentValue={robot ? Number(robot.telemetry.temp).toFixed(1) : '--'}
                            unit="°C"
                            status={getSensorStatus(Number(robot?.telemetry.temp) || 28, sensorStore.sensors.temperature.thresholds)}
                        >
                            <SensorLineChart
                                label="Temperature (°C)"
                                data={tempData}
                                color="#EF4444"
                            />
                        </SensorPanel>
                    </Animated.View>
                </View>

                {/* Export button */}
                <Button
                    variant="primary"
                    style={{ marginTop: 20, marginBottom: 40 }}
                >
                    DOWNLOAD PDF REPORT
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
}

function LiveSensorValue({ label, value, unit, color }: { label: string; value: string; unit?: string; color: string }) {
    return (
        <View style={styles.liveItem}>
            <Text variant="caption" style={{ fontSize: 10, opacity: 0.5 }}>{label}</Text>
            <Text variant="mono" style={{ color, fontSize: 13, fontWeight: '600' }}>
                {value}
                {unit && <Text variant="caption" style={{ fontSize: 9 }}> {unit}</Text>}
            </Text>
        </View>
    );
}

function SensorPanel({ label, currentValue, unit, status, children }: {
    label: string; currentValue: string; unit: string;
    status: { label: string; color: string }; children: React.ReactNode;
}) {
    const theme = useTheme<Theme>();
    return (
        <GlassCard style={styles.sensorPanel}>
            <View style={styles.sensorPanelHeader}>
                <View>
                    <Text variant="body" style={{ fontWeight: '600' }}>{label}</Text>
                </View>
                <View style={styles.sensorPanelRight}>
                    <Text variant="mono" style={{ fontSize: 18, fontWeight: '700' }}>{currentValue}</Text>
                    <Text variant="caption" style={{ marginLeft: 4 }}>{unit}</Text>
                    <Pressable style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
                        <View style={[styles.dot, { backgroundColor: status.color, width: 6, height: 6 }]} />
                        <Text variant="caption" style={{ color: status.color, fontWeight: '600', fontSize: 10 }}>
                            {status.label}
                        </Text>
                    </Pressable>
                </View>
            </View>
            {children}
        </GlassCard>
    );
}

function getSensorStatus(value: number, thresholds: { caution: number; critical: number }): { label: string; color: string } {
    if (value >= thresholds.critical) return { label: 'CRITICAL', color: '#FF6B6B' };
    if (value >= thresholds.caution) return { label: 'CAUTION', color: '#FFA94D' };
    return { label: 'NORMAL', color: '#34D399' };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    exportBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pollutionCard: {
        padding: 20,
        marginBottom: 24,
    },
    pollutionContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pollutionGauge: {
        marginRight: 20,
    },
    pollutionInfo: {
        flex: 1,
    },
    severityPill: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 12,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    liveSensors: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    liveItem: {
        alignItems: 'center',
    },
    chartsContainer: {
        gap: 20,
        marginTop: 20,
    },
    sensorPanel: {
        padding: 16,
    },
    sensorPanelHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sensorPanelRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 10,
    },
});

export default WaterAnalyticsScreen;
