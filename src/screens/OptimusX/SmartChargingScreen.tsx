import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, SPACE } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import SectionHeader from '../../components/SectionHeader';
import IconBadge from '../../components/IconBadge';
import SimpleChart from '../../components/charts/SimpleChart';
import { useRobotStore } from '../../store/useRobotStore';

export default function SmartChargingScreen() {
    const { robots, selectedRobotId } = useRobotStore();
    const robot = robots.find(r => r.id === selectedRobotId) || robots[0];

    const batteryLevel = robot?.battery || 0;
    const isCharging = robot?.status === 'CHARGING';
    const voltage = robot?.telemetry.voltage || 0;
    const solarInput = isCharging ? 45 : 0; // Mock solar input when charging


    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <Text style={styles.title}>Energy Matrix</Text>
                    <Text style={styles.subtitle}>Smart Grid & Fleet Power Management</Text>
                </MotiView>

                <GlassCard style={styles.mainBatteryCard} variant="heavy">
                    <MotiView
                        from={{ opacity: 0.3 }}
                        animate={{ opacity: isCharging ? 0.6 : 0.3 }}
                        transition={{ loop: true, duration: 1500 } as any}
                        style={[styles.chargingGlow, { backgroundColor: COLORS.success }]}
                    />

                    <View style={styles.batteryContainer}>
                        <View style={styles.batteryHead} />
                        <View style={styles.batteryBody}>
                            <MotiView
                                from={{ width: '0%' }}
                                animate={{ width: `${batteryLevel}%` }}
                                style={[styles.batteryFill, { backgroundColor: COLORS.success }]}
                            >
                                <LinearGradient
                                    colors={[COLORS.white + '40', 'transparent']}
                                    start={{ x: 0, y: 0.5 }}
                                    end={{ x: 1, y: 0.5 }}
                                    style={StyleSheet.absoluteFill}
                                />
                            </MotiView>
                            <View style={styles.batteryOverlay}>
                                <AnimatePresence>
                                    {isCharging && (
                                        <MotiView
                                            from={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            style={styles.boltWrapper}
                                        >
                                            <MaterialCommunityIcons name="lightning-bolt" size={40} color={COLORS.white} />
                                        </MotiView>
                                    )}
                                </AnimatePresence>
                                <Text style={styles.batteryPercentage}>{batteryLevel}%</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.powerStats}>
                        <View style={styles.pItem}>
                            <Text style={styles.pVal}>{isCharging ? '3.2 kW' : '0.0 kW'}</Text>
                            <Text style={styles.pLabel}>INFLOW</Text>
                        </View>
                        <View style={styles.pItem}>
                            <Text style={styles.pVal}>{isCharging ? `${Math.floor((100 - batteryLevel) * 0.8)}m` : '--'}</Text>
                            <Text style={styles.pLabel}>TO FULL</Text>
                        </View>
                        <View style={styles.pItem}>
                            <Text style={styles.pVal}>{voltage.toFixed(1)}V</Text>
                            <Text style={styles.pLabel}>VOLTAGE</Text>
                        </View>
                    </View>

                </GlassCard>

                <SectionHeader title="Power Sources" />
                <View style={styles.sourceGrid}>
                    <GlassCard style={styles.sourceCard}>
                        <IconBadge icon="solar-power" size={40} color={COLORS.warning} />
                        <Text style={styles.sVal}>{solarInput}W</Text>
                        <Text style={styles.sLabel}>Solar Array</Text>
                    </GlassCard>
                    <GlassCard style={styles.sourceCard} variant="elevated">
                        <IconBadge icon="ev-station" size={40} color={COLORS.primary} />
                        <Text style={styles.sVal}>2.4kW</Text>
                        <Text style={styles.sLabel}>Dock Station</Text>
                    </GlassCard>
                </View>

                <SectionHeader title="Efficiency Trend" />
                <GlassCard>
                    <SimpleChart
                        data={[40, 55, 48, 62, 58, 75, 82]}
                        labels={['1', '2', '3', '4', '5', '6', '7']}
                        color={COLORS.success}
                        height={140}
                        title="Charge Rate (Past 12h)"
                    />
                </GlassCard>

                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Eco Savings</Text>
                    <View style={styles.ecoRow}>
                        <SimpleChart data={[98, 95, 90, 85, 80, 75, 78]} labels={['1', '2', '3', '4', '5', '6', '7']} color={COLORS.success} height={120} title="Battery Cycle Trend" />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACE[6], paddingTop: 80, paddingBottom: 60 },
    title: { ...FONTS.extraBold, fontSize: 32, color: COLORS.text },
    subtitle: { ...FONTS.medium, fontSize: 16, color: COLORS.textSecondary, marginBottom: SPACE[6] },
    mainBatteryCard: { alignItems: 'center', paddingVertical: 40, marginBottom: 20, overflow: 'hidden' },
    chargingGlow: { position: 'absolute', top: -50, width: 250, height: 250, borderRadius: 125, opacity: 0.3 },
    batteryContainer: { width: 140, height: 240, justifyContent: 'center', alignItems: 'center' },
    batteryHead: { width: 40, height: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderTopLeftRadius: 6, borderTopRightRadius: 6 },
    batteryBody: { width: 120, height: 210, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 16, borderWidth: 4, borderColor: 'rgba(255,255,255,0.1)', overflow: 'hidden', justifyContent: 'flex-end' },
    batteryFill: { position: 'absolute', bottom: 0, left: 0, right: 0 },
    batteryOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
    boltWrapper: { marginBottom: 10 },
    batteryPercentage: { ...FONTS.extraBold, fontSize: 28, color: COLORS.white },
    powerStats: { flexDirection: 'row', width: '100%', marginTop: 40, justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 20 },
    pItem: { alignItems: 'center' },
    pVal: { ...FONTS.bold, fontSize: 16, color: COLORS.text },
    pLabel: { ...FONTS.semiBold, fontSize: 9, color: COLORS.textMuted, marginTop: 4, letterSpacing: 1 },
    sourceGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    sourceCard: { width: '48%', alignItems: 'center', paddingVertical: 20 },
    sVal: { ...FONTS.bold, fontSize: 18, color: COLORS.text, marginTop: 10 },
    sLabel: { ...FONTS.medium, fontSize: 12, color: COLORS.textSecondary },
    summaryCard: { marginTop: 10, padding: 16 },
    summaryTitle: { ...FONTS.bold, fontSize: 16, color: COLORS.text, marginBottom: 8 },
    ecoRow: { flexDirection: 'row', alignItems: 'center' },
    ecoText: { ...FONTS.medium, fontSize: 14, color: COLORS.textSecondary, marginLeft: 10 },
});