import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, useAnimatedStyle, withRepeat, withTiming, interpolate, useSharedValue, withDelay } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, SPACE, SHADOWS } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import SectionHeader from '../../components/SectionHeader';
import ScreenHeader from '../../components/ScreenHeader';
import WebLineChart from '../../components/charts/WebLineChart';

const TREND_DATA = [
    { day: 'Mon', cases: 5 },
    { day: 'Tue', cases: 12 },
    { day: 'Wed', cases: 28 },
    { day: 'Thu', cases: 18 },
    { day: 'Fri', cases: 24 },
    { day: 'Sat', cases: 14 },
    { day: 'Sun', cases: 9 },
];

const RadarMarker = ({ color = COLORS.danger }: { color?: string }) => {
    const pulse = useSharedValue(0);

    React.useEffect(() => {
        pulse.value = withRepeat(
            withTiming(1, { duration: 2000 }),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 2.5]) }],
        opacity: interpolate(pulse.value, [0, 0.5, 1], [0.6, 0.3, 0]),
    }));

    return (
        <View style={styles.radarContainer}>
            <Animated.View style={[styles.radarRing, { backgroundColor: color }, animatedStyle]} />
            <View style={[styles.radarCore, { backgroundColor: color }]}>
                <MaterialCommunityIcons name="alert-decagram" size={14} color="white" />
            </View>
        </View>
    );
};

export default function SymptomTrendsScreen() {
    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <ScreenHeader
                        title="Health Trends"
                        subtitle="Disease Analytics & Early Outbreak Detection"
                    />
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <SectionHeader title="7-Day Incident Trend" />
                    <GlassCard style={styles.chartCard} variant="heavy">
                        <View style={styles.chartTitleRow}>
                            <View>
                                <Text style={styles.chartTitle}>Gastrointestinal Complaints</Text>
                                <Text style={styles.chartSub}>Weekly aggregate (Sector 4 focus)</Text>
                            </View>
                            <View style={styles.trendBadge}>
                                <MaterialCommunityIcons name="trending-up" size={16} color={COLORS.danger} />
                                <Text style={styles.trendText}>+32%</Text>
                            </View>
                        </View>

                        <WebLineChart
                            data={TREND_DATA}
                            xKey="day"
                            lines={[
                                { key: 'cases', color: COLORS.danger, strokeWidth: 4, filled: true },
                            ]}
                            height={180}
                        />

                        <View style={styles.chartFooter}>
                            {TREND_DATA.map((d, i) => (
                                <Text key={i} style={styles.footerLabel}>{d.day}</Text>
                            ))}
                        </View>
                    </GlassCard>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(300).springify()}>
                    <SectionHeader title="Geographical Hotspots" />
                    <View style={styles.hotspotGrid}>
                        <GlassCard style={styles.hotspotCard} variant="elevated">
                            <View style={styles.hotspotHeader}>
                                <RadarMarker color={COLORS.danger} />
                                <View style={styles.hotspotInfo}>
                                    <Text style={styles.hVal}>Sector 4</Text>
                                    <View style={[styles.riskTag, { backgroundColor: COLORS.danger + '20' }]}>
                                        <Text style={[styles.riskText, { color: COLORS.danger }]}>CRITICAL</Text>
                                    </View>
                                </View>
                            </View>
                            <Text style={styles.hDesc}>High correlation with TDS spikes in Lane 2B.</Text>
                        </GlassCard>

                        <GlassCard style={styles.hotspotCard} variant="elevated">
                            <View style={styles.hotspotHeader}>
                                <RadarMarker color={COLORS.warning} />
                                <View style={styles.hotspotInfo}>
                                    <Text style={styles.hVal}>North Inlet</Text>
                                    <View style={[styles.riskTag, { backgroundColor: COLORS.warning + '20' }]}>
                                        <Text style={[styles.riskText, { color: COLORS.warning }]}>STABLE</Text>
                                    </View>
                                </View>
                            </View>
                            <Text style={styles.hDesc}>Residual turbidity found in 2 households.</Text>
                        </GlassCard>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(500).springify()}>
                    <GlassCard style={styles.summaryBox} variant="heavy">
                        <View style={styles.sumHeader}>
                            <View style={styles.hexIcon}>
                                <MaterialCommunityIcons name="shield-search" size={24} color={COLORS.accent} />
                            </View>
                            <Text style={styles.sumTitle}>Expert Recommendation</Text>
                        </View>
                        <Text style={styles.sumDesc}>
                            Correlation detected between bacterial spike in TDS tests and gastro-incidents. Prioritize deep cleaning of filtration membranes in Sector 4 and conduct home visits for vulnerable demographics.
                        </Text>
                    </GlassCard>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACE[6], paddingTop: 60, paddingBottom: 60 },
    chartCard: { padding: 20, marginBottom: 24, borderRadius: 24 },
    chartTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
    chartTitle: { ...FONTS.bold, fontSize: 16, color: COLORS.text },
    chartSub: { ...FONTS.medium, fontSize: 12, color: COLORS.textMuted },
    trendBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.danger + '15', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    trendText: { ...FONTS.bold, fontSize: 12, color: COLORS.danger, marginLeft: 4 },
    victoryWrapper: { height: 180, width: '100%' },
    chartFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, paddingHorizontal: 5 },
    footerLabel: { ...FONTS.medium, fontSize: 10, color: COLORS.textMuted },
    hotspotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 24 },
    hotspotCard: { flex: 1, minWidth: 160, maxWidth: 320, borderRadius: 20 },
    hotspotHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    hotspotInfo: { marginLeft: 12 },
    hVal: { ...FONTS.bold, fontSize: 15, color: COLORS.text },
    riskTag: { marginTop: 2, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
    riskText: { ...FONTS.bold, fontSize: 9, letterSpacing: 0.5 },
    hDesc: { ...FONTS.medium, fontSize: 11, color: COLORS.textSecondary, lineHeight: 16 },
    radarContainer: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
    radarRing: { position: 'absolute', width: 32, height: 32, borderRadius: 16 },
    radarCore: { width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
    summaryBox: { padding: 24, borderRadius: 24, borderLeftWidth: 4, borderLeftColor: COLORS.accent },
    sumHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    hexIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.accent + '15', justifyContent: 'center', alignItems: 'center' },
    sumTitle: { ...FONTS.bold, fontSize: 17, color: COLORS.accent, marginLeft: 16 },
    sumDesc: { ...FONTS.medium, fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
});