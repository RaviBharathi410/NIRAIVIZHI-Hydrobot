import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions, TouchableOpacity, ScrollView } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useRobotStore } from '../../store/useRobotStore';
import { useAlertStore } from '../../store/useAlertStore';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme/restyleTheme';
import Text from '../../components/atoms/Text';
import { RobotStatusCard } from '../../components/robot/RobotStatusCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { HydrobotTabParamList } from '../../navigation/HydrobotNavigator';
import { FABMenu } from '../../components/ui/FABMenu';
import GlassCard from '../../components/GlassCard';
import { RingGauge } from '../../components/RingGauge';
import Robot3D from '../../components/animations/Robot3D';
import { calcPollutionIndex, getPollutionSeverity } from '../../utils/pollutionIndex';

type Props = BottomTabScreenProps<HydrobotTabParamList, 'Fleet'>;

export function DashboardScreen({ navigation }: Props) {
    const theme = useTheme<Theme>();
    const { robots, isLoading, connectionStatus, missionStats } = useRobotStore();
    const alertStore = useAlertStore();
    const { width } = useWindowDimensions();
    const numColumns = width > 600 ? 2 : 1;

    // Helper to format time (seconds to Hh Mm)
    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    };

    // Calculate composite Water Quality Index from all robots
    const waterQuality = useMemo(() => {
        if (robots.length === 0) return { index: 0, severity: getPollutionSeverity(0) };
        const avgPh = robots.reduce((acc, r) => acc + Number(r.telemetry.ph), 0) / robots.length;
        const avgTurbidity = robots.reduce((acc, r) => acc + Number(r.telemetry.turbidity), 0) / robots.length;
        const avgTemp = robots.reduce((acc, r) => acc + Number(r.telemetry.temp), 0) / robots.length;
        const avgTds = robots.reduce((acc, r) => acc + Number(r.telemetry.tds), 0) / robots.length;
        const index = calcPollutionIndex({ ph: avgPh, turbidity: avgTurbidity, temperature: avgTemp, tds: avgTds });
        // Invert for "quality" display: 100 - pollution = quality
        const qualityScore = 100 - index;
        return { index: qualityScore, severity: getPollutionSeverity(index) };
    }, [robots]);

    const unreadAlerts = alertStore.unreadCount();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background as string }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <Animated.View entering={FadeIn.delay(200)} style={styles.header}>
                    <View>
                        <Text variant="heading">HYDROBOT</Text>
                        <Text variant="caption">CONTROL CENTER</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <ConnectionBadge status={connectionStatus} />
                        <TouchableOpacity
                            style={styles.statsIcon}
                            onPress={() => navigation.navigate('Alerts')}
                        >
                            <MaterialCommunityIcons name="bell-outline" size={24} color={theme.colors.text as string} />
                            {unreadAlerts > 0 && (
                                <View style={styles.alertBadge}>
                                    <Text variant="caption" style={styles.alertBadgeText}>{unreadAlerts}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* 3D Model Header */}
                <Animated.View entering={FadeInDown.delay(250).springify()}>
                    <View style={{ height: 200, width: '100%', marginBottom: 16 }}>
                        <Robot3D />
                    </View>
                </Animated.View>

                {/* Water Quality Index Card */}
                <Animated.View entering={FadeInDown.delay(300).springify()}>
                    <GlassCard style={styles.wqiCard}>
                        <View style={styles.wqiContent}>
                            <View style={styles.wqiGauge}>
                                <RingGauge
                                    value={waterQuality.index}
                                    maxValue={100}
                                    size={100}
                                    strokeWidth={10}
                                    color={waterQuality.severity.color}
                                />
                            </View>
                            <View style={styles.wqiInfo}>
                                <Text variant="caption" style={{ fontWeight: '700', letterSpacing: 1 }}>WATER QUALITY INDEX</Text>
                                <View style={[styles.severityBadge, { backgroundColor: waterQuality.severity.bgColor }]}>
                                    <View style={[styles.severityDot, { backgroundColor: waterQuality.severity.color }]} />
                                    <Text variant="caption" style={{ color: waterQuality.severity.color, fontWeight: '700' }}>
                                        {waterQuality.severity.label.toUpperCase()}
                                    </Text>
                                </View>
                                <Text variant="caption" style={{ opacity: 0.5, marginTop: 4 }}>
                                    Composite score from all active sensors
                                </Text>
                            </View>
                        </View>
                    </GlassCard>
                </Animated.View>

                {/* Mission Summary */}
                <Animated.View entering={FadeInDown.delay(400).springify()}>
                    <GlassCard style={styles.missionCard}>
                        <Text variant="caption" style={{ fontWeight: '700', marginBottom: 8 }}>TODAY'S MISSION</Text>
                        <View style={styles.missionStats}>
                            <MissionStat label="Distance" value={`${missionStats.totalDistance.toFixed(1)} km`} icon="map-marker-distance" />
                            <MissionStat label="Trash" value={`${missionStats.totalTrash} kg`} icon="trash-can" />
                            <MissionStat label="Time" value={formatTime(missionStats.totalTime)} icon="clock-outline" />
                        </View>
                    </GlassCard>
                </Animated.View>


                {/* Recent Alerts Strip */}
                {unreadAlerts > 0 && (
                    <Animated.View entering={FadeInDown.delay(500).springify()}>
                        <View style={styles.alertsHeader}>
                            <Text variant="caption" style={{ fontWeight: '700', letterSpacing: 1 }}>RECENT ALERTS</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Alerts')}>
                                <Text variant="caption" style={{ color: theme.colors.primary as string, fontWeight: '700' }}>VIEW ALL</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.alertsStrip}>
                            {alertStore.alerts.filter(a => !a.read).slice(0, 5).map((alert) => (
                                <GlassCard key={alert.id} style={styles.alertStripCard}>
                                    <View style={[styles.alertDot, {
                                        backgroundColor: alert.severity === 'critical' ? '#FF6B6B'
                                            : alert.severity === 'warning' ? '#FFA94D' : '#22D3EE'
                                    }]} />
                                    <Text variant="caption" style={{ fontWeight: '600' }} numberOfLines={1}>{alert.title}</Text>
                                    <Text variant="caption" style={{ fontSize: 11, opacity: 0.5 }} numberOfLines={1}>{alert.message}</Text>
                                </GlassCard>
                            ))}
                        </ScrollView>
                    </Animated.View>
                )}

                {/* Fleet Overview */}
                <Text variant="subheading" style={{ marginBottom: 16, marginTop: 8 }}>FLEET OVERVIEW</Text>

                {robots.map((robot, index) => (
                    <Animated.View key={robot.id} entering={FadeInDown.delay(600 + index * 80).springify()}>
                        <RobotStatusCard
                            robot={robot as any}
                            index={index}
                            isLoading={isLoading}
                            onPress={() => navigation.navigate('Control', { id: robot.id })}
                        />
                    </Animated.View>
                ))}

                <View style={{ height: 120 }} />
            </ScrollView>

            <FABMenu />
        </View>
    );
}

function ConnectionBadge({ status }: { status: string }) {
    const theme = useTheme<Theme>();
    const color = status === 'CONNECTED' ? (theme.colors.success as string) : status === 'CONNECTING' ? (theme.colors.warning as string) : (theme.colors.danger as string);
    return (
        <View style={[styles.connectionBadge, { borderColor: color + '40' }]}>
            <View style={[styles.statusDot, { backgroundColor: color }]} />
            <Text variant="caption" style={{ color: theme.colors.textSecondary as string, marginLeft: 6 }}>{status}</Text>
        </View>
    );
}

function MissionStat({ label, value, icon }: { label: string, value: string, icon: any }) {
    const theme = useTheme<Theme>();
    return (
        <View style={{ alignItems: 'center' }}>
            <MaterialCommunityIcons name={icon} size={20} color={theme.colors.primary as string} />
            <Text variant="caption" style={{ fontWeight: '700', marginVertical: 2 }}>{value}</Text>
            <Text variant="caption" style={{ fontSize: 10, opacity: 0.6 }}>{label.toUpperCase()}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 24,
    },
    statsIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertBadge: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: '#FF6B6B',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    connectionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 12,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    wqiCard: {
        padding: 20,
        marginBottom: 16,
    },
    wqiContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    wqiGauge: {
        marginRight: 20,
    },
    wqiInfo: {
        flex: 1,
    },
    severityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 8,
    },
    severityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    missionCard: {
        padding: 16,
        marginBottom: 16,
    },
    missionStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    alertsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    alertsStrip: {
        marginBottom: 24,
    },
    alertStripCard: {
        padding: 12,
        marginRight: 12,
        width: 220,
    },
    alertDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginBottom: 6,
    },
});

export default DashboardScreen;
