import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, SPACE } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import SectionHeader from '../../components/SectionHeader';
import ScreenHeader from '../../components/ScreenHeader';
import { CartesianChart, Line, Area } from 'victory-native';

const CORRELATION_DATA = [
    { hour: '00', ph: 7.2, symptoms: 2 },
    { hour: '04', ph: 7.0, symptoms: 3 },
    { hour: '08', ph: 6.5, symptoms: 12 },
    { hour: '12', ph: 6.2, symptoms: 25 },
    { hour: '16', ph: 6.4, symptoms: 18 },
    { hour: '20', ph: 6.8, symptoms: 8 },
    { hour: '23', ph: 7.1, symptoms: 4 },
];

const SECTOR_METRICS = [
    { name: 'Sector 4', risk: 'CRITICAL', caseload: 110, trend: '+14%' },
    { name: 'North Inlet', risk: 'STABLE', caseload: 42, trend: '-2%' },
    { name: 'West Delta', risk: 'MONITOR', caseload: 65, trend: '+5%' },
];

export default function RegionalAnalyticsScreen() {
    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <ScreenHeader
                        title="Health Intelligence"
                        subtitle="Multi-Vector Correlation Analysis"
                        showBack={true}
                    />
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <SectionHeader title="Contaminant vs. Symptom Correlation" />
                    <GlassCard style={styles.chartCard} variant="heavy">
                        <View style={styles.chartLegend}>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: COLORS.danger }]} />
                                <Text style={styles.legendText}>Symptoms Count</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: COLORS.info }]} />
                                <Text style={styles.legendText}>pH Deviation (x10)</Text>
                            </View>
                        </View>

                        <View style={styles.victoryWrapper}>
                            <CartesianChart
                                data={CORRELATION_DATA}
                                xKey="hour"
                                yKeys={["symptoms", "ph"]}
                                axisOptions={{
                                    font: null as any,
                                    labelColor: COLORS.textMuted,
                                    lineColor: 'rgba(255,255,255,0.05)',
                                }}
                            >
                                {({ points }) => (
                                    <>
                                        <Area
                                            points={points.symptoms}
                                            y0={0}
                                            color={COLORS.danger + '30'}
                                        />
                                        <Line
                                            points={points.symptoms}
                                            color={COLORS.danger}
                                            strokeWidth={3}
                                            curveType="monotoneX"
                                        />
                                        <Line
                                            points={points.ph.map(p => ({ ...p, y: p.y * 5 }))} // Scaled for visualization
                                            color={COLORS.info}
                                            strokeWidth={2}
                                            curveType="monotoneX"
                                        />
                                    </>
                                )}
                            </CartesianChart>
                        </View>
                        <Text style={styles.chartNote}>
                            * pH values scaled 5x for visual alignment with caseload metrics.
                        </Text>
                    </GlassCard>
                </Animated.View>

                <SectionHeader title="Sector Risk Matrix" />
                <View style={styles.sectorList}>
                    {SECTOR_METRICS.map((sector, i) => (
                        <Animated.View
                            key={sector.name}
                            entering={FadeInDown.delay(300 + i * 100).springify()}
                        >
                            <GlassCard style={styles.sectorCard} variant="elevated">
                                <View style={styles.sectorMain}>
                                    <Text style={styles.sectorName}>{sector.name}</Text>
                                    <View style={[
                                        styles.riskBadge,
                                        { backgroundColor: sector.risk === 'CRITICAL' ? COLORS.danger + '20' : COLORS.success + '20' }
                                    ]}>
                                        <Text style={[
                                            styles.riskText,
                                            { color: sector.risk === 'CRITICAL' ? COLORS.danger : COLORS.success }
                                        ]}>
                                            {sector.risk}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.sectorStats}>
                                    <View style={styles.statGroup}>
                                        <Text style={styles.sLabel}>CASELOAD</Text>
                                        <Text style={styles.sVal}>{sector.caseload}</Text>
                                    </View>
                                    <View style={styles.statGroup}>
                                        <Text style={styles.sLabel}>TREND</Text>
                                        <Text style={[
                                            styles.sVal,
                                            { color: sector.trend.startsWith('+') ? COLORS.danger : COLORS.success }
                                        ]}>
                                            {sector.trend}
                                        </Text>
                                    </View>
                                    <TouchableOpacity style={styles.drillDownBtn}>
                                        <MaterialCommunityIcons name="magnify-expand" size={20} color={COLORS.primary} />
                                    </TouchableOpacity>
                                </View>
                            </GlassCard>
                        </Animated.View>
                    ))}
                </View>

                <Animated.View entering={ZoomIn.delay(600)} style={styles.insightBox}>
                    <LinearGradient
                        colors={[COLORS.primary + '20', 'transparent']}
                        style={styles.insightGradient}
                    >
                        <MaterialCommunityIcons name="lightbulb-on-outline" size={24} color={COLORS.primary} />
                        <View style={styles.insightText}>
                            <Text style={styles.insightTitle}>Automated Insight</Text>
                            <Text style={styles.insightDesc}>
                                82% probability that Sector 4 incidents are linked to the pH drop at 08:00 AM. Recommend immediate inspection of the primary inlet valves.
                            </Text>
                        </View>
                    </LinearGradient>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scrollContent: { padding: SPACE[6], paddingTop: 60, paddingBottom: 60 },
    chartCard: { padding: 20, marginBottom: 24, borderRadius: 24 },
    chartLegend: { flexDirection: 'row', gap: 16, marginBottom: 20 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    legendDot: { width: 8, height: 8, borderRadius: 4 },
    legendText: { ...FONTS.medium, fontSize: 11, color: COLORS.textMuted },
    victoryWrapper: { height: 220, width: '100%' },
    chartNote: { ...FONTS.medium, fontSize: 10, color: COLORS.textMuted, marginTop: 12, fontStyle: 'italic' },
    sectorList: { gap: 12, marginBottom: 24 },
    sectorCard: { padding: 18, borderRadius: 20 },
    sectorMain: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectorName: { ...FONTS.bold, fontSize: 17, color: COLORS.text },
    riskBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    riskText: { ...FONTS.bold, fontSize: 10, letterSpacing: 1 },
    sectorStats: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    statGroup: { flex: 1 },
    sLabel: { ...FONTS.bold, fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, marginBottom: 4 },
    sVal: { ...FONTS.bold, fontSize: 18, color: COLORS.text },
    drillDownBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.surfaceLight, justifyContent: 'center', alignItems: 'center' },
    insightBox: { borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.primary + '30' },
    insightGradient: { padding: 24, flexDirection: 'row', gap: 16 },
    insightText: { flex: 1 },
    insightTitle: { ...FONTS.bold, fontSize: 16, color: COLORS.primary, marginBottom: 6 },
    insightDesc: { ...FONTS.medium, fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
});
