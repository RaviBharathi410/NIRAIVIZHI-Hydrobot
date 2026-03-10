import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, SPACE } from '../../constants/theme';
import useBluetoothMock from '../../hooks/useBluetoothMock';
import AlertSystem from '../../services/AlertSystem';
import GlassCard from '../../components/GlassCard';
import RingGauge from '../../components/RingGauge';
import SensorConnectionButton from '../../components/SensorConnectionButton';
import SimpleChart from '../../components/charts/SimpleChart';
import SkeletonLoader from '../../components/SkeletonLoader';
import ScreenHeader from '../../components/ScreenHeader';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OptimusXStackParamList } from '../../navigation/OptimusXStack';

type Props = NativeStackScreenProps<OptimusXStackParamList, 'PHTesting'>;

export default function PHTestingScreen({ }: Props) {
    const { isConnected, isScanning, sensorData, scan, connect, disconnect } = useBluetoothMock();
    const [history, setHistory] = useState<number[]>([]);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setInitializing(false), 800);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (sensorData) {
            setHistory(prev => [...prev.slice(-11), parseFloat(String(sensorData.ph))]);
        }
    }, [sensorData]);

    const ph = sensorData ? parseFloat(String(sensorData.ph)) : 7.0;
    const status = sensorData ? AlertSystem.getWaterStatus('ph', sensorData.ph) : 'neutral';
    const statusColor = status === 'safe' ? COLORS.success : status === 'moderate' ? COLORS.warning : COLORS.danger;

    // PH scale colors mapping
    const getPHColor = (val: number) => {
        const index = Math.min(Math.max(Math.floor(val), 0), COLORS.phScale.length - 1);
        return COLORS.phScale[index];
    };

    if (initializing) {
        return (
            <View style={styles.container}>
                <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />
                <View style={styles.loadingContent}>
                    <SkeletonLoader height={250} borderRadius={30} style={{ marginBottom: 20 }} />
                    <SkeletonLoader height={100} borderRadius={20} style={{ marginBottom: 20 }} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <ScreenHeader
                    title="pH Laboratory"
                    subtitle="Hydrogen-ion Activity Monitoring"
                    style={{ paddingHorizontal: SPACE[6], paddingTop: 20 }}
                />

                <SensorConnectionButton
                    isConnected={isConnected}
                    isScanning={isScanning}
                    onConnect={() => { scan(); setTimeout(() => connect('PH-PROBE-X'), 2000); }}
                    onDisconnect={disconnect}
                />

                <AnimatePresence>
                    {sensorData && (
                        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }}>
                            <GlassCard style={styles.mainCard} variant="heavy">
                                <View style={[styles.glowBackground, { backgroundColor: getPHColor(ph) + '15' }]} />

                                <RingGauge
                                    value={ph}
                                    maxValue={14}
                                    size={200}
                                    strokeWidth={18}
                                    color={getPHColor(ph)}
                                    unit="pH"
                                    label={ph < 7 ? 'ACIDIC' : ph > 7 ? 'ALKALINE' : 'NEUTRAL'}
                                />

                                <View style={styles.scaleContainer}>
                                    <Text style={styles.scaleLabel}>pH Scale</Text>
                                    <View style={styles.scaleBar}>
                                        {COLORS.phScale.map((c, i) => (
                                            <View
                                                key={i}
                                                style={[
                                                    styles.scaleSegment,
                                                    { backgroundColor: c },
                                                    Math.floor(ph) === i && styles.activeSegment
                                                ]}
                                            />
                                        ))}
                                    </View>
                                    <View style={styles.scaleRangeRow}>
                                        <Text style={styles.rangeText}>Acidic</Text>
                                        <Text style={styles.rangeText}>Neutral</Text>
                                        <Text style={styles.rangeText}>Alkaline</Text>
                                    </View>
                                </View>
                            </GlassCard>

                            <GlassCard>
                                <View style={styles.adviceRow}>
                                    <MaterialCommunityIcons
                                        name={status === 'safe' ? "check-decagram" : "information-outline"}
                                        size={28}
                                        color={statusColor}
                                    />
                                    <View style={styles.adviceText}>
                                        <Text style={[styles.adviceTitle, { color: statusColor }]}>Current Status: {status.toUpperCase()}</Text>
                                        <Text style={styles.adviceSub}>
                                            {ph < 6.5 ? 'Water is significantly acidic. Potential pipe corrosion risk.' :
                                                ph > 8.5 ? 'High alkalinity detected. May cause scale buildup in filtration.' :
                                                    'Optimal balance for healthy aquatic life and human usage.'}
                                        </Text>
                                    </View>
                                </View>
                            </GlassCard>

                            {history.length > 2 && (
                                <GlassCard>
                                    <SimpleChart
                                        data={history}
                                        labels={['T-5', 'T-4', 'T-3', 'T-2', 'T-1', 'NOW']}
                                        color={getPHColor(ph)}
                                        height={150}
                                        title="pH Stability Trends"
                                    />
                                </GlassCard>
                            )}
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
    mainCard: { alignItems: 'center', paddingVertical: 40, marginBottom: 20, overflow: 'hidden' },
    glowBackground: { ...StyleSheet.absoluteFillObject, opacity: 0.1 },
    scaleContainer: { width: '100%', marginTop: 40, paddingHorizontal: 20 },
    scaleLabel: { ...FONTS.bold, fontSize: 12, color: COLORS.textMuted, textAlign: 'center', marginBottom: 12, letterSpacing: 2 },
    scaleBar: { flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden' },
    scaleSegment: { flex: 1 },
    activeSegment: { transform: [{ scaleY: 1.8 }], zIndex: 10, borderWidth: 1, borderColor: COLORS.white },
    scaleRangeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
    rangeText: { ...FONTS.semiBold, fontSize: 10, color: COLORS.textMuted, textTransform: 'uppercase' },
    adviceRow: { flexDirection: 'row', alignItems: 'flex-start' },
    adviceText: { flex: 1, marginLeft: 16 },
    adviceTitle: { ...FONTS.bold, fontSize: 16 },
    adviceSub: { ...FONTS.medium, fontSize: 13, color: COLORS.textSecondary, marginTop: 4, lineHeight: 20 },
});