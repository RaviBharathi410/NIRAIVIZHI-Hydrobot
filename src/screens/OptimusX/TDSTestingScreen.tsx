import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import { COLORS, FONTS, GRADIENTS, SPACE } from '../../constants/theme';
import useBluetoothMock from '../../hooks/useBluetoothMock';
import AlertSystem from '../../services/AlertSystem';
import GlassCard from '../../components/GlassCard';
import RingGauge from '../../components/RingGauge';
import SensorConnectionButton from '../../components/SensorConnectionButton';
import SimpleChart from '../../components/charts/SimpleChart';
import SkeletonLoader from '../../components/SkeletonLoader';
import IconBadge from '../../components/IconBadge';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OptimusXStackParamList } from '../../navigation/OptimusXStack';

type Props = NativeStackScreenProps<OptimusXStackParamList, 'TDSTesting'>;

export default function TDSTestingScreen({ }: Props) {
    const { isConnected, isScanning, sensorData, scan, connect, disconnect } = useBluetoothMock();
    const [history, setHistory] = useState<number[]>([]);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setInitializing(false), 800);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (sensorData) {
            setHistory(prev => [...prev.slice(-11), sensorData.tds]);
        }
    }, [sensorData]);

    const status = sensorData ? AlertSystem.getWaterStatus('tds', sensorData.tds) : 'unknown';
    const statusColor = status === 'safe' ? COLORS.success : status === 'moderate' ? COLORS.warning : COLORS.danger;

    if (initializing) {
        return (
            <View style={styles.container}>
                <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />
                <View style={styles.loadingContent}>
                    <SkeletonLoader height={40} width="60%" style={{ marginBottom: 12 }} />
                    <SkeletonLoader height={20} width="40%" style={{ marginBottom: 30 }} />
                    <SkeletonLoader height={80} borderRadius={20} style={{ marginBottom: 20 }} />
                    <SkeletonLoader height={200} borderRadius={30} style={{ marginBottom: 20 }} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <MotiView
                    from={{ opacity: 0, translateX: -20 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    style={styles.header}
                >
                    <Text style={styles.title}>TDS Analysis</Text>
                    <Text style={styles.subtitle}>Total Dissolved Solids Precision Meter</Text>
                </MotiView>

                <SensorConnectionButton
                    isConnected={isConnected}
                    isScanning={isScanning}
                    onConnect={() => { scan(); setTimeout(() => connect('AG-SENSOR-001'), 2500); }}
                    onDisconnect={disconnect}
                />

                <AnimatePresence>
                    {sensorData ? (
                        <MotiView
                            from={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring' } as any}
                        >
                            <GlassCard style={styles.gaugeCard} variant="heavy">
                                <View style={styles.gaugeHeader}>
                                    <View style={[styles.statusLine, { backgroundColor: statusColor }]} />
                                    <Text style={styles.gaugeTitle}>Live Reading</Text>
                                    <Text style={[styles.statusText, { color: statusColor }]}>{status.toUpperCase()}</Text>
                                </View>

                                <RingGauge
                                    value={sensorData.tds}
                                    maxValue={800}
                                    size={180}
                                    strokeWidth={16}
                                    color={statusColor}
                                    unit="PPM"
                                />

                                <View style={styles.infoGrid}>
                                    <View style={styles.infoItem}>
                                        <Text style={styles.infoLabel}>STABILITY</Text>
                                        <Text style={styles.infoValue}>High</Text>
                                    </View>
                                    <View style={styles.infoItem}>
                                        <Text style={styles.infoLabel}>ACCURACY</Text>
                                        <Text style={styles.infoValue}>±2%</Text>
                                    </View>
                                </View>
                            </GlassCard>

                            <GlassCard>
                                <Text style={styles.sectionTitle}>Reference Standards</Text>
                                <View style={styles.refRow}>
                                    <View style={[styles.refBar, { backgroundColor: COLORS.success }]} />
                                    <View style={styles.refInfo}>
                                        <Text style={styles.refRange}>0 - 300 ppm</Text>
                                        <Text style={styles.refLabel}>Excellent / Safe for consumption</Text>
                                    </View>
                                </View>
                                <View style={styles.refRow}>
                                    <View style={[styles.refBar, { backgroundColor: COLORS.warning }]} />
                                    <View style={styles.refInfo}>
                                        <Text style={styles.refRange}>301 - 600 ppm</Text>
                                        <Text style={styles.refLabel}>Acceptable irrigation range</Text>
                                    </View>
                                </View>
                                <View style={styles.refRow}>
                                    <View style={[styles.refBar, { backgroundColor: COLORS.danger, height: 40 }]} />
                                    <View style={styles.refInfo}>
                                        <Text style={styles.refRange}>600+ ppm</Text>
                                        <Text style={styles.refLabel}>Dangerous level / High salinity</Text>
                                    </View>
                                </View>
                            </GlassCard>

                            {history.length > 2 && (
                                <GlassCard>
                                    <SimpleChart
                                        data={history}
                                        labels={['10m', '8m', '6m', '4m', '2m', 'NOW']}
                                        color={statusColor}
                                        height={140}
                                        title="Real-time Fluctuations"
                                    />
                                </GlassCard>
                            )}
                        </MotiView>
                    ) : !isScanning ? (
                        <MotiView
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={styles.emptyContainer}
                        >
                            <IconBadge icon="bluetooth-off" size={80} color={COLORS.textMuted} />
                            <Text style={styles.emptyTitle}>Sensor Offline</Text>
                            <Text style={styles.emptySub}>Please enable Bluetooth and connect a compatible probe to view live diagnostics.</Text>
                        </MotiView>
                    ) : null}
                </AnimatePresence>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    loadingContent: { padding: SPACE[6], paddingTop: 80 },
    content: { padding: SPACE[6], paddingTop: 80, paddingBottom: 50 },
    header: { marginBottom: SPACE[6] },
    title: { ...FONTS.extraBold, fontSize: 32, color: COLORS.white },
    subtitle: { ...FONTS.medium, fontSize: 16, color: COLORS.textSecondary },
    gaugeCard: { alignItems: 'center', paddingVertical: 30, marginBottom: 20 },
    gaugeHeader: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingHorizontal: 10 },
    statusLine: { position: 'absolute', left: -10, top: 0, bottom: 0, width: 4, borderRadius: 2 },
    gaugeTitle: { ...FONTS.bold, fontSize: 14, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 1 },
    statusText: { ...FONTS.extraBold, fontSize: 13, letterSpacing: 1 },
    infoGrid: { flexDirection: 'row', width: '100%', marginTop: 30, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 20 },
    infoItem: { flex: 1, alignItems: 'center' },
    infoLabel: { ...FONTS.semiBold, fontSize: 10, color: COLORS.textMuted, letterSpacing: 1 },
    infoValue: { ...FONTS.bold, fontSize: 16, color: COLORS.white, marginTop: 4 },
    sectionTitle: { ...FONTS.bold, fontSize: 18, color: COLORS.white, marginBottom: 16 },
    refRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    refBar: { width: 6, height: 34, borderRadius: 3, marginRight: 16 },
    refInfo: { flex: 1 },
    refRange: { ...FONTS.bold, fontSize: 14, color: COLORS.white },
    refLabel: { ...FONTS.medium, fontSize: 12, color: COLORS.textSecondary },
    emptyContainer: { alignItems: 'center', marginTop: 60, paddingHorizontal: 30 },
    emptyTitle: { ...FONTS.bold, fontSize: 20, color: COLORS.white, marginTop: 24 },
    emptySub: { ...FONTS.medium, fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 22 },
});