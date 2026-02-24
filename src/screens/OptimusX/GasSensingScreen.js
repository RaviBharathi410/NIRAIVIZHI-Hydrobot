import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, GRADIENTS, SPACE } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import SectionHeader from '../../components/SectionHeader';
import RingGauge from '../../components/RingGauge';
import IconBadge from '../../components/IconBadge';

export default function GasSensingScreen() {
    const [gasLevels, setGasLevels] = useState({
        methane: 12,
        co2: 420,
        ammonia: 5,
        sulfide: 2,
    });

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }}>
                    <Text style={styles.title}>Atmospheric Lab</Text>
                    <Text style={styles.subtitle}>Hazardous Gas & Air Quality Monitoring</Text>
                </MotiView>

                <SectionHeader title="Critical Metrics" />
                <View style={styles.gaugeGrid}>
                    <GlassCard style={styles.gaugeCard}>
                        <RingGauge value={gasLevels.methane} maxValue={100} size={130} strokeWidth={10} color={COLORS.danger} unit="%" />
                        <Text style={styles.gasLabel}>Methane (CH₄)</Text>
                    </GlassCard>
                    <GlassCard style={styles.gaugeCard}>
                        <RingGauge value={65} maxValue={100} size={130} strokeWidth={10} color={COLORS.warning} unit="PPM" />
                        <Text style={styles.gasLabel}>Ammonia (NH₃)</Text>
                    </GlassCard>
                </View>

                <SectionHeader title="General Air Quality" />
                <GlassCard style={styles.aqiCard} variant="elevated">
                    <View style={styles.aqiRow}>
                        <IconBadge icon="leaf" size={50} color={COLORS.success} />
                        <View style={styles.aqiInfo}>
                            <Text style={styles.aqiTitle}>AQI - EXCELLENT</Text>
                            <Text style={styles.aqiValue}>Score: 42 / 500</Text>
                        </View>
                        <View style={styles.aqiBadge}>
                            <Text style={styles.aqiTag}>OPTIMAL</Text>
                        </View>
                    </View>
                </GlassCard>

                <SectionHeader title="Secondary Sensors" />
                <View style={styles.secondaryGrid}>
                    <GlassCard style={styles.secItem}>
                        <MaterialCommunityIcons name="molecule" size={24} color={COLORS.accent} />
                        <Text style={styles.secVal}>{gasLevels.co2} PPM</Text>
                        <Text style={styles.secLabel}>CO₂ Level</Text>
                    </GlassCard>
                    <GlassCard style={styles.secItem}>
                        <MaterialCommunityIcons name="filter-outline" size={24} color={COLORS.accent} />
                        <Text style={styles.secVal}>{gasLevels.sulfide} PPM</Text>
                        <Text style={styles.secLabel}>Hydrogen Sulfide</Text>
                    </GlassCard>
                </View>

                <GlassCard style={styles.safetyCard}>
                    <View style={styles.safetyHeader}>
                        <MaterialCommunityIcons name="shield-account" size={24} color={COLORS.primary} />
                        <Text style={styles.safetyTitle}>Safety Protocol</Text>
                    </View>
                    <Text style={styles.safetyText}>
                        All gas levels are within OSHA permissible limits. Automatic evacuation triggers are armed.
                    </Text>
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
    gaugeGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    gaugeCard: { width: '48%', alignItems: 'center', paddingVertical: 20 },
    gasLabel: { ...FONTS.bold, fontSize: 12, color: COLORS.white, marginTop: 15, textAlign: 'center' },
    aqiCard: { padding: 16, marginBottom: 24 },
    aqiRow: { flexDirection: 'row', alignItems: 'center' },
    aqiInfo: { flex: 1, marginLeft: 16 },
    aqiTitle: { ...FONTS.bold, fontSize: 16, color: COLORS.success },
    aqiValue: { ...FONTS.medium, fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
    aqiBadge: { backgroundColor: COLORS.success + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
    aqiTag: { ...FONTS.extraBold, fontSize: 9, color: COLORS.success },
    secondaryGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    secItem: { width: '48%', alignItems: 'center', paddingVertical: 16 },
    secVal: { ...FONTS.bold, fontSize: 16, color: COLORS.white, marginTop: 8 },
    secLabel: { ...FONTS.medium, fontSize: 10, color: COLORS.textMuted, marginTop: 2, textTransform: 'uppercase' },
    safetyCard: { marginTop: 10 },
    safetyHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    safetyTitle: { ...FONTS.bold, fontSize: 16, color: COLORS.white, marginLeft: 12 },
    safetyText: { ...FONTS.medium, fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
});