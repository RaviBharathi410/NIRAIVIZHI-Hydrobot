import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useRobotStore } from '../../store/useRobotStore';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme/restyleTheme';
import Text from '../../components/atoms/Text';
import { SensorLineChart } from '../../components/charts/SensorLineChart';
import { GaugeChart } from '../../components/charts/GaugeChart';
import { TimeRangeSelector } from '../../components/charts/TimeRangeSelector';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { HydrobotTabParamList } from '../../navigation/HydrobotNavigator';

type Props = BottomTabScreenProps<HydrobotTabParamList, 'Analytics'>;

export function WaterAnalyticsScreen({ route }: Props) {
    const theme = useTheme<Theme>();
    const { robots, fetchRobotHistory } = useRobotStore();

    const activeRobotId = (route.params as any)?.id || (robots.length > 0 ? robots[0].id : '1');
    const robot = robots.find(r => r.id === activeRobotId);

    const [range, setRange] = useState<'1H' | '6H' | '24H' | '7D'>('1H');

    useEffect(() => {
        if (!robot) return;
        fetchRobotHistory(robot.id);
        const interval = setInterval(() => fetchRobotHistory(robot.id), 5000);
        return () => clearInterval(interval);
    }, [robot, fetchRobotHistory]);

    if (!robot) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background as string, justifyContent: 'center', alignItems: 'center' }]}>
                <Text variant="subheading">No Data Available</Text>
            </SafeAreaView>
        );
    }

    // Format historical data for charts
    const phHistory = robot.history.map(h => ({ timestamp: h.timestamp, value: h.ph }));
    const turbidityHistory = robot.history.map(h => ({ timestamp: h.timestamp, value: h.turbidity }));
    const pollutionHistory = robot.history.map(h => ({ timestamp: h.timestamp, value: h.pollutionIndex }));

    const getIndexStatus = (index: number) => {
        if (index < 30) return { label: 'EXCELLENT', color: theme.colors.success as string };
        if (index < 50) return { label: 'GOOD', color: theme.colors.success as string };
        if (index < 70) return { label: 'FAIR', color: theme.colors.warning as string };
        return { label: 'POOR', color: theme.colors.danger as string };
    };

    const status = getIndexStatus(robot.telemetry.pollutionIndex || 0);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background as string }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text variant="heading" style={{ fontSize: 24 }}>Water Quality</Text>
                    <Text variant="caption">{robot.name} — Real-time Analysis</Text>
                </View>

                <TimeRangeSelector selected={range} onChange={setRange} />

                <View style={styles.gaugeRow}>
                    <GaugeChart value={robot.telemetry.temp} label="Temperature" unit="°C" size={130} />
                    <GaugeChart value={robot.telemetry.ph} min={0} max={14} label="pH Level" unit="pH" size={130} />
                </View>

                <View style={styles.summaryCard}>
                    <Text variant="body" style={{ fontWeight: '700', marginBottom: 4 }}>Pollution Index</Text>
                    <View style={styles.indexRow}>
                        <Text variant="heading" style={{ color: status.color, fontSize: 36 }}>
                            {robot.telemetry.pollutionIndex || '--'}
                        </Text>
                        <View style={styles.indexStatus}>
                            <Text variant="caption" style={{ color: status.color, fontWeight: '700' }}>{status.label}</Text>
                            <Text variant="caption" color="textMuted">Composite Score</Text>
                        </View>
                    </View>
                </View>

                <SensorLineChart
                    label="pH Trend"
                    data={phHistory}
                    color={theme.colors.primary as string}
                />

                <SensorLineChart
                    label="Turbidity Trend"
                    data={turbidityHistory}
                    color="#F59E0B"
                />

                <SensorLineChart
                    label="Pollution Index Trend"
                    data={pollutionHistory}
                    color={status.color}
                />

                <View style={styles.statsGrid}>
                    <StatItem label="TDS" value={`${robot.telemetry.tds} ppm`} status="Optimal" color={theme.colors.success as string} />
                    <StatItem label="Dissolved O2" value="8.4 mg/L" status="Normal" color={theme.colors.success as string} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function StatItem({ label, value, status, color }: { label: string, value: string, status: string, color: string }) {
    return (
        <View style={styles.statItem}>
            <Text variant="caption" color="textMuted">{label}</Text>
            <Text variant="subheading">{value}</Text>
            <Text variant="caption" style={{ color, fontWeight: '700' }}>{status}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
        paddingHorizontal: 20,
    },
    header: {
        paddingVertical: 24,
    },
    gaugeRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    summaryCard: {
        padding: 20,
        backgroundColor: '#FFF',
        borderRadius: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(15, 23, 42, 0.05)',
    },
    indexRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    indexStatus: {
        marginLeft: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    statItem: {
        flex: 0.48,
        padding: 16,
        backgroundColor: '#FFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(15, 23, 42, 0.05)',
    },
});

export default WaterAnalyticsScreen;
