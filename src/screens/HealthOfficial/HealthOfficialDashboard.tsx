import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    FadeInDown,
    FadeInRight,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    interpolate
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, SPACE, SHADOWS } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import SectionHeader from '../../components/SectionHeader';
import AnimatedButton from '../../components/AnimatedButton';
import { CartesianChart, Line } from 'victory-native';
import ScreenHeader from '../../components/ScreenHeader';

const CHART_DATA = [
    { day: 'Mon', caseload: 40, baseline: 30 },
    { day: 'Tue', caseload: 35, baseline: 32 },
    { day: 'Wed', caseload: 60, baseline: 31 },
    { day: 'Thu', caseload: 85, baseline: 33 },
    { day: 'Fri', caseload: 95, baseline: 35 },
    { day: 'Sat', caseload: 110, baseline: 34 },
    { day: 'Sun', caseload: 105, baseline: 36 },
];

const CrisisPulse = () => {
    const pulse = useSharedValue(0);

    useEffect(() => {
        pulse.value = withRepeat(
            withTiming(1, { duration: 1500 }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 1.2]) }],
        opacity: interpolate(pulse.value, [0, 1], [1, 0.6]),
    }));

    return (
        <Animated.View style={[styles.pulseCircle, animatedStyle]}>
            <MaterialCommunityIcons name="alert-decagram" size={24} color="white" />
        </Animated.View>
    );
};

export default function HealthOfficialDashboard({ navigation }: any) {
    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <ScreenHeader
                        title="Regional Hub"
                        subtitle="Health Oversight & Sanitation Intelligence"
                        showBack={false}
                    />
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.alertBanner}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => navigation.navigate('RegionalAnalytics')}
                    >
                        <GlassCard style={styles.alertCard} variant="heavy">
                            <LinearGradient
                                colors={[COLORS.danger, '#B91C1C']}
                                style={styles.alertIconBox}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <CrisisPulse />
                            </LinearGradient>
                            <View style={styles.alertInfo}>
                                <Text style={styles.alertTitle}>CRITICAL ANOMALY</Text>
                                <Text style={styles.alertText}>
                                    Bacterial spike detected in Sector 4. Correlation with TDS spike: High.
                                </Text>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.textMuted} />
                        </GlassCard>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(300).springify()}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => navigation.navigate('RegionalAnalytics')}
                    >
                        <SectionHeader title="Caseload Intelligence" />
                    </TouchableOpacity>
                    <GlassCard style={styles.chartCard} variant="heavy">
                        <View style={styles.chartLegend}>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: COLORS.danger }]} />
                                <Text style={styles.legendText}>Active Cases</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: COLORS.primary + '40' }]} />
                                <Text style={styles.legendText}>Regional Baseline</Text>
                            </View>
                        </View>

                        <View style={styles.victoryWrapper}>
                            <CartesianChart
                                data={CHART_DATA}
                                xKey="day"
                                yKeys={["caseload", "baseline"]}
                                axisOptions={{
                                    font: null as any,
                                    labelColor: COLORS.textMuted,
                                    lineColor: 'rgba(255,255,255,0.05)',
                                }}
                            >
                                {({ points }) => (
                                    <>
                                        <Line
                                            points={points.baseline}
                                            color={COLORS.primary + '40'}
                                            strokeWidth={2}
                                            curveType="monotoneX"
                                        />
                                        <Line
                                            points={points.caseload}
                                            color={COLORS.danger}
                                            strokeWidth={4}
                                            curveType="monotoneX"
                                        />
                                    </>
                                )}
                            </CartesianChart>
                        </View>
                        <View style={styles.chartFooter}>
                            {CHART_DATA.map((d, i) => (
                                <Text key={i} style={styles.footerLabel}>{d.day}</Text>
                            ))}
                        </View>
                    </GlassCard>
                </Animated.View>

                <SectionHeader title="Operational Resources" />
                <View style={styles.grid}>
                    <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.gridItem}>
                        <GlassCard style={styles.gridCard} variant="elevated">
                            <View style={[styles.gridIcon, { backgroundColor: COLORS.accent + '15' }]}>
                                <MaterialCommunityIcons name="ambulance" size={24} color={COLORS.accent} />
                            </View>
                            <Text style={styles.gridVal}>12</Text>
                            <Text style={styles.gridLabel}>Mobile Units</Text>
                            <View style={styles.statusBox}>
                                <View style={styles.statusDot} />
                                <Text style={styles.statusText}>READY</Text>
                            </View>
                        </GlassCard>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.gridItem}>
                        <GlassCard style={styles.gridCard} variant="elevated">
                            <View style={[styles.gridIcon, { backgroundColor: COLORS.primary + '15' }]}>
                                <MaterialCommunityIcons name="water-pump" size={24} color={COLORS.primary} />
                            </View>
                            <Text style={styles.gridVal}>84%</Text>
                            <Text style={styles.gridLabel}>Plant Efficiency</Text>
                            <View style={[styles.statusBox, { backgroundColor: COLORS.warning + '10' }]}>
                                <View style={[styles.statusDot, { backgroundColor: COLORS.warning }]} />
                                <Text style={[styles.statusText, { color: COLORS.warning }]}>MAINTENANCE</Text>
                            </View>
                        </GlassCard>
                    </Animated.View>
                </View>

                <Animated.View entering={FadeInDown.delay(600).springify()}>
                    <SectionHeader title="Active Directives" />
                    <GlassCard style={styles.directiveCard} variant="heavy">
                        <View style={styles.dirHeader}>
                            <MaterialCommunityIcons name="broadcast" size={24} color={COLORS.primary} />
                            <Text style={styles.dirTitle}>Water Boil Protocol v2</Text>
                        </View>
                        <Text style={styles.dirDesc}>
                            Enforcing mandatory boiling protocol for Sector 4 and North Inlet due to detected microbial spike.
                        </Text>
                        <View style={styles.dirStats}>
                            <View style={styles.dirStatItem}>
                                <Text style={styles.dirStatVal}>8.4k</Text>
                                <Text style={styles.dirStatLabel}>Reached</Text>
                            </View>
                            <View style={styles.dirStatItem}>
                                <Text style={styles.dirStatVal}>92%</Text>
                                <Text style={styles.dirStatLabel}>Sync Rate</Text>
                            </View>
                        </View>
                        <AnimatedButton
                            title="Update Directive"
                            variant="primary"
                            iconRight="send-circle-outline"
                            style={styles.dirBtn}
                            onPress={() => navigation.navigate('DirectiveControl')}
                        />
                    </GlassCard>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scrollContent: { padding: SPACE[6], paddingTop: 60, paddingBottom: 60 },
    alertBanner: { marginBottom: 24 },
    alertCard: { padding: 16, flexDirection: 'row', alignItems: 'center', borderRadius: 24 },
    alertIconBox: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    pulseCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
    alertInfo: { flex: 1, marginLeft: 16, marginRight: 8 },
    alertTitle: { ...FONTS.bold, fontSize: 13, color: COLORS.danger, letterSpacing: 1 },
    alertText: { ...FONTS.medium, fontSize: 13, color: COLORS.textSecondary, marginTop: 2, lineHeight: 18 },
    chartCard: { padding: 20, marginBottom: 24, borderRadius: 24 },
    chartLegend: { flexDirection: 'row', gap: 16, marginBottom: 20 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    legendDot: { width: 8, height: 8, borderRadius: 4 },
    legendText: { ...FONTS.medium, fontSize: 11, color: COLORS.textMuted },
    victoryWrapper: { height: 180, width: '100%' },
    chartFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, paddingHorizontal: 5 },
    footerLabel: { ...FONTS.medium, fontSize: 10, color: COLORS.textMuted },
    grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    gridItem: { width: '48%' },
    gridCard: { padding: 20, alignItems: 'center', borderRadius: 22 },
    gridIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    gridVal: { ...FONTS.extraBold, fontSize: 24, color: COLORS.text },
    gridLabel: { ...FONTS.bold, fontSize: 11, color: COLORS.textMuted, marginTop: 4, textTransform: 'uppercase' },
    statusBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.success + '10', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginTop: 12 },
    statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.success, marginRight: 6 },
    statusText: { ...FONTS.bold, fontSize: 9, color: COLORS.success },
    directiveCard: { padding: 24, borderRadius: 24 },
    dirHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
    dirTitle: { ...FONTS.bold, fontSize: 18, color: COLORS.text },
    dirDesc: { ...FONTS.medium, fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
    dirStats: { flexDirection: 'row', marginTop: 20, gap: 32 },
    dirStatItem: {},
    dirStatVal: { ...FONTS.bold, fontSize: 16, color: COLORS.text },
    dirStatLabel: { ...FONTS.medium, fontSize: 11, color: COLORS.textMuted },
    dirBtn: { marginTop: 24 },
});