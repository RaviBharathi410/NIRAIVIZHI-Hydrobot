import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, SPACE } from '../../constants/theme';
import { useRobotStore } from '../../store/useRobotStore';
import AlertSystem from '../../services/AlertSystem';
import GlassCard from '../../components/GlassCard';
import RingGauge from '../../components/RingGauge';
import SensorConnectionButton from '../../components/SensorConnectionButton';
import SimpleChart from '../../components/charts/SimpleChart';
import SkeletonLoader from '../../components/SkeletonLoader';
import ScreenHeader from '../../components/ScreenHeader';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OptimusXStackParamList } from '../../navigation/OptimusXStack';

type Props = NativeStackScreenProps<OptimusXStackParamList, 'TurbidityTesting'>;

export default function TurbidityTestingScreen({ }: Props) {
    const { robots, selectedRobotId, connectionStatus } = useRobotStore();
    const robot = robots.find(r => r.id === selectedRobotId) || robots[0];
    const turbidityValue = robot?.telemetry.turbidity || 0;

    const [history, setHistory] = useState<number[]>([]);
    const [initializing, setInitializing] = useState(true);

    const isConnected = connectionStatus === 'CONNECTED' && robot?.status === 'ONLINE';

    useEffect(() => {
        const timer = setTimeout(() => setInitializing(false), 800);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isConnected) {
            setHistory(prev => [...prev.slice(-11), turbidityValue]);
        }
    }, [turbidityValue, isConnected]);

    const turbidity = turbidityValue;
    const status = isConnected ? AlertSystem.getWaterStatus('turbidity', turbidity) : 'unknown';
    const statusColor = status === 'safe' ? COLORS.success : status === 'moderate' ? COLORS.warning : COLORS.danger;


    if (initializing) {
        return (
            <View style={styles.container}>
                <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />
                <View style={styles.loadingContent}>
                    <SkeletonLoader height={300} borderRadius={30} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <ScreenHeader
                    title="Clarification"
                    subtitle="Turbidity & TSS Optical Diagnostic"
                    style={{ paddingHorizontal: SPACE[6], paddingTop: 20 }}
                />

                <SensorConnectionButton
                    isConnected={isConnected}
                    isScanning={false}
                    onConnect={() => { }}
                    onDisconnect={() => { }}
                />

                <AnimatePresence>
                    {isConnected ? (
                        <MotiView
                            key="data-view"
                            from={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring' } as any}
                        >
                            <GlassCard style={styles.mainCard} variant="heavy">
                                <RingGauge
                                    value={turbidity}
                                    maxValue={50}
                                    size={190}
                                    strokeWidth={16}
                                    color={statusColor}
                                    unit="NTU"
                                    label="CLARITY"
                                />

                                <View style={[styles.visualizer, { backgroundColor: statusColor + '10' }]}>
                                    <MaterialCommunityIcons name="water-opacity" size={24} color={statusColor} />
                                    <Text style={[styles.visualText, { color: statusColor }]}>
                                        {turbidity < 5 ? 'Crystal Clear' : turbidity < 15 ? 'Sluggish' : 'Highly Opaque'}
                                    </Text>
                                </View>
                            </GlassCard>

                            <GlassCard>
                                <Text style={styles.sectionTitle}>NTU Definition</Text>
                                <Text style={styles.manualText}>
                                    Nephelometric Turbidity Units (NTU) measure the intensity of light scattered by particles.
                                    High values indicate heavy concentration of suspended solids or algae blooms.
                                </Text>
                                <View style={styles.thresholdRow}>
                                    <View style={styles.tItem}>
                                        <Text style={[styles.tVal, { color: COLORS.success }]}>&lt;5</Text>
                                        <Text style={styles.tLabel}>Ideal</Text>
                                    </View>
                                    <View style={styles.tItem}>
                                        <Text style={[styles.tVal, { color: COLORS.danger }]}>&gt;25</Text>
                                        <Text style={styles.tLabel}>Critical</Text>
                                    </View>
                                </View>
                            </GlassCard>

                            {history.length > 2 && (
                                <GlassCard>
                                    <SimpleChart
                                        data={history}
                                        labels={['T-5', 'T-4', 'T-3', 'T-2', 'T-1', 'NOW']}
                                        color={statusColor}
                                        height={130}
                                        title="Optical Variation History"
                                    />
                                </GlassCard>
                            )}
                        </MotiView>
                    ) : (
                        <MotiView
                            key="offline-view"
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={styles.emptyContainer}
                        >
                            <MaterialCommunityIcons name="robot-off" size={80} color={COLORS.textMuted} style={styles.centeredIcon} />
                            <Text style={styles.emptyTitle}>Robot Link Offline</Text>
                            <Text style={styles.emptySub}>Optical sensor data for {robot?.name || 'the robot'} is currently unavailable.</Text>
                        </MotiView>
                    )}
                </AnimatePresence>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    loadingContent: { padding: SPACE[6], paddingTop: 80 },
    content: { padding: SPACE[6], paddingTop: 20, paddingBottom: 50 },
    title: { ...FONTS.extraBold, fontSize: 32, color: COLORS.white },
    subtitle: { ...FONTS.medium, fontSize: 16, color: COLORS.textSecondary, marginBottom: SPACE[6] },
    mainCard: { alignItems: 'center', paddingVertical: 40, marginBottom: 20 },
    visualizer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    visualText: { ...FONTS.bold, fontSize: 15, marginLeft: 10, letterSpacing: 1 },
    sectionTitle: { ...FONTS.bold, fontSize: 18, color: COLORS.white, marginBottom: 12 },
    manualText: { ...FONTS.regular, fontSize: 14, color: COLORS.textSecondary, lineHeight: 22, marginBottom: 20 },
    thresholdRow: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
    tItem: { alignItems: 'center' },
    tVal: { ...FONTS.bold, fontSize: 18 },
    tLabel: { ...FONTS.medium, fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
    emptyContainer: { alignItems: 'center', marginTop: 60, paddingHorizontal: 30 },
    centeredIcon: { marginBottom: 20 },
    emptyTitle: { ...FONTS.bold, fontSize: 20, color: COLORS.white, marginTop: 24 },
    emptySub: { ...FONTS.medium, fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 22 },
});
