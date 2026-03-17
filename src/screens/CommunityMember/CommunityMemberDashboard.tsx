import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, SPACE, SHADOWS } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import ScreenHeader from '../../components/ScreenHeader';
import { useRobotStore } from '../../store/useRobotStore';

const { width } = Dimensions.get('window');

const WATER_DEPOTS = [
    { id: '1', name: 'Primary Alpha Dispenser', status: 'Active', purity: 99.8, distance: '200m' },
    { id: '2', name: 'Sector B Station', status: 'Maintenance', purity: null, distance: '850m' },
    { id: '3', name: 'Community Hub Filter', status: 'Active', purity: 98.5, distance: '1.2km' },
];

const QUICK_ACTIONS = [
    { id: 'report', icon: 'alert-decagram-outline', label: 'Report', color: COLORS.danger },
    { id: 'find', icon: 'map-marker-radius-outline', label: 'Find Water', color: COLORS.primary },
    { id: 'health', icon: 'heart-pulse', label: 'Health tips', color: COLORS.success },
    { id: 'alerts', icon: 'bell-badge-outline', label: 'Alerts', color: COLORS.warning },
];

export default function CommunityMemberDashboard({ navigation }: any) {
    const robots = useRobotStore(state => state.robots);
    const nearestBot = robots.find(r => r.id === '1') || robots[0];
    const isWaterSafe = (nearestBot?.telemetry.ph || 7) >= 6.5 && (nearestBot?.telemetry.ph || 7) <= 8.5;

    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: withRepeat(withSequence(withTiming(1.05, { duration: 1000 }), withTiming(1, { duration: 1000 })), -1, true) }]
    }));

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <ScreenHeader title="Citizen Portal" subtitle="Namaste, Ravi" showBack={false} showMenu={true} />
                </Animated.View>

                {/* SUPER PREMIUM HERO */}
                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <View style={styles.heroWrapper}>
                        <LinearGradient colors={isWaterSafe ? [COLORS.success, '#0d2b1a'] : [COLORS.danger, '#2b0d0d']} style={StyleSheet.absoluteFill} start={{x:0, y:0}} end={{x:1, y:1}} />
                        <View style={styles.heroContent}>
                            <Animated.View style={[styles.statusRing, pulseStyle, { borderColor: isWaterSafe ? COLORS.success : COLORS.danger }]}>
                                <MaterialCommunityIcons name={isWaterSafe ? "water-check" : "water-alert"} size={48} color={COLORS.text} />
                            </Animated.View>
                            <View style={styles.heroTextContainer}>
                                <Text style={styles.heroTitle}>{isWaterSafe ? 'WATER IS SAFE' : 'WATER ADVISORY'}</Text>
                                <Text style={styles.heroSub}>{isWaterSafe ? 'Real-time readings indicate local tap water is safe to consume directly.' : 'Anomalies detected in local supply. Boiling recommended.'}</Text>
                            </View>
                        </View>
                        <View style={styles.metricsBar}>
                            <View style={styles.metricItem}>
                                <Text style={styles.metricVal}>{nearestBot?.telemetry.tds || 120} <Text style={styles.metricUnit}>ppm</Text></Text>
                                <Text style={styles.metricLabel}>TDS LEVEL</Text>
                            </View>
                            <View style={styles.metricDiv} />
                            <View style={styles.metricItem}>
                                <Text style={styles.metricVal}>{nearestBot?.telemetry.ph || 7.2}</Text>
                                <Text style={styles.metricLabel}>pH LEVEL</Text>
                            </View>
                            <View style={styles.metricDiv} />
                            <View style={styles.metricItem}>
                                <Text style={styles.metricVal}>{nearestBot?.telemetry.turbidity || 1.1} <Text style={styles.metricUnit}>ntu</Text></Text>
                                <Text style={styles.metricLabel}>TURBIDITY</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>

                {/* QUICK ACTIONS ROW */}
                <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.actionsContainer}>
                    {QUICK_ACTIONS.map((action) => (
                        <TouchableOpacity key={action.id} style={styles.actionBtn}>
                            <View style={[styles.actionIconBg, { backgroundColor: action.color + '15' }]}>
                                <MaterialCommunityIcons name={action.icon as any} size={28} color={action.color} />
                            </View>
                            <Text style={styles.actionLabel}>{action.label}</Text>
                        </TouchableOpacity>
                    ))}
                </Animated.View>

                {/* LIVE WATER DEPOTS */}
                <Animated.View entering={FadeInDown.delay(400).springify()}>
                    <View style={styles.sectionTitleRow}>
                        <Text style={styles.sectionTitle}>Nearest Safe Depots</Text>
                        <TouchableOpacity><Text style={styles.seeAll}>Map View</Text></TouchableOpacity>
                    </View>
                    
                    {WATER_DEPOTS.map((depot, i) => (
                        <Animated.View key={depot.id} entering={FadeInRight.delay(500 + i * 100).springify()}>
                            <GlassCard style={styles.depotCard} variant="elevated">
                                <View style={styles.depotLeft}>
                                    <View style={[styles.depotIconWrapper, { backgroundColor: depot.status === 'Active' ? COLORS.primary + '20' : COLORS.textMuted + '20' }]}>
                                        <MaterialCommunityIcons name="water-pump" size={24} color={depot.status === 'Active' ? COLORS.primary : COLORS.textMuted} />
                                    </View>
                                    <View>
                                        <Text style={styles.depotName}>{depot.name}</Text>
                                        <View style={styles.depotDistanceRow}>
                                            <MaterialCommunityIcons name="map-marker-distance" size={14} color={COLORS.textSecondary} />
                                            <Text style={styles.depotDistance}>{depot.distance} away</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.depotRight}>
                                    <Text style={[styles.depotPurity, { color: depot.status === 'Active' ? COLORS.success : COLORS.textMuted }]}>
                                        {depot.purity ? `${depot.purity}%` : '--'}
                                    </Text>
                                    <Text style={styles.depotPurityLabel}>{depot.status === 'Active' ? 'Purity' : 'Offline'}</Text>
                                </View>
                            </GlassCard>
                        </Animated.View>
                    ))}
                </Animated.View>

                {/* COMMUNITY IMPACT CHART SIMULATION */}
                <Animated.View entering={FadeInDown.delay(600).springify()}>
                    <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Community Contribution</Text>
                    <GlassCard style={styles.impactCard}>
                        <View style={styles.impactHeader}>
                            <MaterialCommunityIcons name="leaf-circle-outline" size={32} color={COLORS.success} />
                            <View style={{marginLeft: 12}}>
                                <Text style={styles.impactTitle}>124 kg</Text>
                                <Text style={styles.impactSub}>Plastic extracted this month</Text>
                            </View>
                        </View>
                        <View style={styles.progressContainer}>
                            <View style={styles.progressBarBg}>
                                <View style={[styles.progressBarFill, { width: '75%', backgroundColor: COLORS.success }]} />
                            </View>
                            <Text style={styles.progressText}>75% of Monthly Goal</Text>
                        </View>
                    </GlassCard>
                </Animated.View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scrollContent: { padding: SPACE[6], paddingTop: 20, paddingBottom: 100 },
    heroWrapper: { borderRadius: 32, overflow: 'hidden', marginBottom: 28, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    heroContent: { padding: 24, flexDirection: 'row', alignItems: 'center' },
    statusRing: { width: 72, height: 72, borderRadius: 36, borderWidth: 3, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' },
    heroTextContainer: { flex: 1, marginLeft: 20 },
    heroTitle: { ...FONTS.extraBold, fontSize: 22, color: COLORS.text, letterSpacing: 0.5 },
    heroSub: { ...FONTS.medium, fontSize: 13, color: COLORS.textSecondary, marginTop: 4, lineHeight: 18 },
    metricsBar: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.05)', paddingVertical: 16, paddingHorizontal: 10 },
    metricItem: { flex: 1, alignItems: 'center' },
    metricVal: { ...FONTS.bold, fontSize: 20, color: COLORS.text },
    metricUnit: { ...FONTS.medium, fontSize: 12, color: COLORS.textMuted },
    metricLabel: { ...FONTS.bold, fontSize: 10, color: COLORS.textSecondary, marginTop: 4, letterSpacing: 1 },
    metricDiv: { width: 1, height: '80%', backgroundColor: 'rgba(0,0,0,0.05)' },
    actionsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
    actionBtn: { alignItems: 'center', width: (width - SPACE[6]*2) / 4 - 8 },
    actionIconBg: { width: 56, height: 56, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    actionLabel: { ...FONTS.bold, fontSize: 11, color: COLORS.text, marginTop: 8, textAlign: 'center' },
    sectionTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
    sectionTitle: { ...FONTS.bold, fontSize: 18, color: COLORS.text, letterSpacing: 0.5 },
    seeAll: { ...FONTS.bold, fontSize: 13, color: COLORS.primary },
    depotCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, marginBottom: 16, borderRadius: 24 },
    depotLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    depotIconWrapper: { width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    depotName: { ...FONTS.bold, fontSize: 16, color: COLORS.text, marginBottom: 4 },
    depotDistanceRow: { flexDirection: 'row', alignItems: 'center' },
    depotDistance: { ...FONTS.medium, fontSize: 13, color: COLORS.textSecondary, marginLeft: 4 },
    depotRight: { alignItems: 'flex-end' },
    depotPurity: { ...FONTS.extraBold, fontSize: 18 },
    depotPurityLabel: { ...FONTS.bold, fontSize: 10, color: COLORS.textMuted, marginTop: 2, textTransform: 'uppercase' },
    impactCard: { padding: 24, borderRadius: 24, marginTop: 16 },
    impactHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    impactTitle: { ...FONTS.extraBold, fontSize: 24, color: COLORS.text },
    impactSub: { ...FONTS.medium, fontSize: 13, color: COLORS.textSecondary },
    progressContainer: { width: '100%' },
    progressBarBg: { width: '100%', height: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
    progressBarFill: { height: '100%', borderRadius: 4 },
    progressText: { ...FONTS.bold, fontSize: 12, color: COLORS.primary, textAlign: 'right' }
});