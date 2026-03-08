import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, SPACE } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import SectionHeader from '../../components/SectionHeader';
import RingGauge from '../../components/RingGauge';
import IconBadge from '../../components/IconBadge';
import AnimatedButton from '../../components/AnimatedButton';

export default function HyacinthProcessingScreen() {
    const [load] = useState(72);

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }}>
                    <Text style={styles.title}>Biomass Core</Text>
                    <Text style={styles.subtitle}>Water Hyacinth Extraction & Processing</Text>
                </MotiView>

                <GlassCard style={styles.mainProcessorCard} variant="heavy">
                    <View style={styles.processorHeader}>
                        <IconBadge icon="leaf" size={60} color={COLORS.success} glow />
                        <View style={styles.processorInfo}>
                            <Text style={styles.pTitle}>Primary Shredder</Text>
                            <Text style={styles.pStatus}>STATUS: RUNNING</Text>
                        </View>
                    </View>

                    <View style={styles.gaugeRow}>
                        <View style={styles.gaugeItem}>
                            <RingGauge value={load} maxValue={100} size={120} strokeWidth={10} color={COLORS.success} unit="%" />
                            <Text style={styles.gaugeLabel}>Load Factor</Text>
                        </View>
                        <View style={styles.gaugeItem}>
                            <RingGauge value={14} maxValue={25} size={120} strokeWidth={10} color={COLORS.primary} unit="ton/h" />
                            <Text style={styles.gaugeLabel}>Throughput</Text>
                        </View>
                    </View>
                </GlassCard>

                <SectionHeader title="System Optimization" />
                <View style={styles.controlGrid}>
                    <GlassCard style={styles.controlCard}>
                        <MaterialCommunityIcons name="speedometer" size={24} color={COLORS.accent} />
                        <Text style={styles.cVal}>2400 RPM</Text>
                        <Text style={styles.cLabel}>Motor Speed</Text>
                    </GlassCard>
                    <GlassCard style={styles.controlCard}>
                        <MaterialCommunityIcons name="thermometer" size={24} color={COLORS.warning} />
                        <Text style={styles.cVal}>42°C</Text>
                        <Text style={styles.cLabel}>Temp</Text>
                    </GlassCard>
                </View>

                <SectionHeader title="Logistics" />
                <GlassCard style={styles.logisticsCard}>
                    <View style={styles.logRow}>
                        <MaterialCommunityIcons name="truck-delivery-outline" size={24} color={COLORS.accent} />
                        <View style={styles.logText}>
                            <Text style={styles.logTitle}>Collection Schedule</Text>
                            <Text style={styles.logSub}>Next pickup from Processing Cell B at 14:00</Text>
                        </View>
                    </View>
                    <AnimatedButton title="Acknowledge Pickup" variant="outline" style={styles.logBtn} />
                </GlassCard>

                <GlassCard style={styles.outputBox} variant="elevated">
                    <Text style={styles.outTitle}>End Product Output</Text>
                    <View style={styles.outGrid}>
                        <View style={styles.outItem}>
                            <Text style={styles.outVal}>420kg</Text>
                            <Text style={styles.outLabel}>Bio-Fertilizer</Text>
                        </View>
                        <View style={styles.outDivider} />
                        <View style={styles.outItem}>
                            <Text style={styles.outVal}>120kg</Text>
                            <Text style={styles.outLabel}>Handicrafts Raw</Text>
                        </View>
                    </View>
                </GlassCard>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACE[6], paddingTop: 80, paddingBottom: 60 },
    title: { ...FONTS.extraBold, fontSize: 32, color: COLORS.white },
    subtitle: { ...FONTS.medium, fontSize: 16, color: COLORS.textSecondary, marginBottom: SPACE[6] },
    mainProcessorCard: { padding: 24, marginBottom: 20 },
    processorHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
    processorInfo: { marginLeft: 20 },
    pTitle: { ...FONTS.bold, fontSize: 20, color: COLORS.white },
    pStatus: { ...FONTS.extraBold, fontSize: 10, color: COLORS.success, marginTop: 4, letterSpacing: 1 },
    gaugeRow: { flexDirection: 'row', justifyContent: 'space-around' },
    gaugeItem: { alignItems: 'center' },
    gaugeLabel: { ...FONTS.bold, fontSize: 12, color: COLORS.textMuted, marginTop: 12 },
    controlGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    controlCard: { width: '48%', alignItems: 'center', paddingVertical: 16 },
    cVal: { ...FONTS.bold, fontSize: 16, color: COLORS.white, marginTop: 8 },
    cLabel: { ...FONTS.medium, fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
    logisticsCard: { padding: 16, marginBottom: 20 },
    logRow: { flexDirection: 'row', alignItems: 'center' },
    logText: { flex: 1, marginLeft: 16 },
    logTitle: { ...FONTS.bold, fontSize: 16, color: COLORS.white },
    logSub: { ...FONTS.medium, fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
    logBtn: { marginTop: 16 },
    outputBox: { padding: 16 },
    outTitle: { ...FONTS.bold, fontSize: 16, color: COLORS.white, marginBottom: 16, textAlign: 'center' },
    outGrid: { flexDirection: 'row', justifyContent: 'space-around' },
    outItem: { alignItems: 'center' },
    outVal: { ...FONTS.bold, fontSize: 22, color: COLORS.accent },
    outLabel: { ...FONTS.medium, fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
    outDivider: { width: 1, height: '80%', backgroundColor: 'rgba(255,255,255,0.08)' },
});