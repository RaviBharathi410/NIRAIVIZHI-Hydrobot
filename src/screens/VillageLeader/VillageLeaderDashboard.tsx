import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, SPACE, SHADOWS } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import ScreenHeader from '../../components/ScreenHeader';
import { useRobotStore } from '../../store/useRobotStore';
import { useAlertStore } from '../../store/useAlertStore';

const { width } = Dimensions.get('window');

const INFRASTRUCTURE = [
    { id: '1', icon: 'hospital-building', name: 'Sector 4 Clinic', status: 'CRITICAL', load: '85%', isWarning: true },
    { id: '2', icon: 'school', name: 'Primary School', status: 'STABLE', load: '40%', isWarning: false },
    { id: '3', icon: 'sprout', name: 'Agri-Sector North', status: 'STABLE', load: '62%', isWarning: false },
];

const ANALYTICS = [
    { label: 'Fleet Op-Time', value: '98.2%', trend: '+1.4%', up: true },
    { label: 'Energy Cost', value: '450 kWh', trend: '-12%', up: true }, // less is better
    { label: 'Filtered Water', value: '1.2 ML', trend: '+5.5%', up: true },
    { label: 'Active Alerts', value: '3', trend: '+2', up: false },
];

export default function VillageLeaderDashboard({ navigation }: any) {
    const robots = useRobotStore(state => state.robots);
    const alerts = useAlertStore(state => state.alerts);
    const onlineBots = robots.filter(r => r.status === 'ONLINE').length;

    // Pulse animation for critical alerts
    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: withRepeat(withSequence(withTiming(1.03, { duration: 800 }), withTiming(1, { duration: 800 })), -1, true) }]
    }));

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <ScreenHeader title="Global Overview" subtitle="Village Leader Command" showBack={false} />
                </Animated.View>

                {/* POSTURE WIDGET */}
                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <GlassCard style={styles.postureCard} variant="heavy">
                        <View style={styles.postureHeader}>
                            <View>
                                <Text style={styles.postureLabel}>CURRENT POSTURE</Text>
                                <Text style={styles.postureValue}>DEFCON 4</Text>
                            </View>
                            <View style={styles.postureBadge}>
                                <MaterialCommunityIcons name="shield-check" size={20} color={COLORS.success} />
                                <Text style={styles.postureBadgeText}>STABILIZED</Text>
                            </View>
                        </View>
                        <View style={styles.postureMapPlaceholder}>
                            <MaterialCommunityIcons name="map-search-outline" size={48} color={'rgba(255,255,255,0.1)'} />
                            <Text style={styles.mapText}>LIVE ASSET TRACKING ACTIVE</Text>
                            <View style={styles.pulseDot} />
                        </View>
                        <View style={styles.fleetSummaryRow}>
                            <View style={styles.fleetItem}>
                                <Text style={styles.fleetVal}>{onlineBots}<Text style={{fontSize: 14, color: COLORS.textMuted}}>/12</Text></Text>
                                <Text style={styles.fleetLabel}>ACTIVE BOTS</Text>
                            </View>
                            <View style={styles.fleetItem}>
                                <Text style={styles.fleetVal}>96<Text style={{fontSize: 14, color: COLORS.textMuted}}>%</Text></Text>
                                <Text style={styles.fleetLabel}>COVERAGE</Text>
                            </View>
                            <View style={styles.fleetItem}>
                                <Text style={styles.fleetVal}>1.2<Text style={{fontSize: 14, color: COLORS.textMuted}}>ms</Text></Text>
                                <Text style={styles.fleetLabel}>LATENCY</Text>
                            </View>
                        </View>
                    </GlassCard>
                </Animated.View>

                {/* KEY ANALYTICS GRID */}
                <Animated.View entering={FadeInDown.delay(300).springify()}>
                    <Text style={styles.sectionTitle}>Performance Analytics</Text>
                    <View style={styles.analyticsGrid}>
                        {ANALYTICS.map((stat, i) => (
                            <GlassCard key={i} style={styles.statCard}>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                                <Text style={styles.statValue}>{stat.value}</Text>
                                <View style={styles.trendRow}>
                                    <MaterialCommunityIcons name={stat.up ? "trending-up" : "trending-down"} size={14} color={stat.up ? COLORS.success : COLORS.danger} />
                                    <Text style={[styles.trendText, { color: stat.up ? COLORS.success : COLORS.danger }]}>{stat.trend}</Text>
                                </View>
                            </GlassCard>
                        ))}
                    </View>
                </Animated.View>

                {/* CRITICAL INFRASTRUCTURE */}
                <Animated.View entering={FadeInDown.delay(400).springify()}>
                    <View style={styles.sectionTitleRow}>
                        <Text style={styles.sectionTitle}>Infrastructure Nodes</Text>
                        <TouchableOpacity><Text style={styles.seeAll}>Manage</Text></TouchableOpacity>
                    </View>
                    
                    {INFRASTRUCTURE.map((node, i) => {
                        const isWarning = node.isWarning;
                        return (
                            <Animated.View key={node.id} entering={FadeInRight.delay(500 + i * 100).springify()} style={isWarning ? pulseStyle : {}}>
                                <GlassCard style={[styles.nodeCard, isWarning && styles.nodeWarning]} variant={isWarning ? 'heavy' : 'elevated'}>
                                    <View style={[styles.nodeIconBg, { backgroundColor: isWarning ? COLORS.danger + '20' : COLORS.primary + '20' }]}>
                                        <MaterialCommunityIcons name={node.icon as any} size={28} color={isWarning ? COLORS.danger : COLORS.primary} />
                                    </View>
                                    <View style={styles.nodeMiddle}>
                                        <Text style={styles.nodeName}>{node.name}</Text>
                                        <Text style={styles.nodeStatus}>Status: <Text style={{color: isWarning ? COLORS.danger : COLORS.success}}>{node.status}</Text></Text>
                                    </View>
                                    <View style={styles.nodeRight}>
                                        <Text style={styles.nodeLoadVal}>{node.load}</Text>
                                        <Text style={styles.nodeLoadLabel}>DEMAND</Text>
                                    </View>
                                </GlassCard>
                            </Animated.View>
                        );
                    })}
                </Animated.View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scrollContent: { padding: SPACE[6], paddingTop: 20, paddingBottom: 100 },
    postureCard: { padding: 24, borderRadius: 32, marginBottom: 32, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    postureHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
    postureLabel: { ...FONTS.bold, fontSize: 12, color: COLORS.textSecondary, letterSpacing: 2 },
    postureValue: { ...FONTS.extraBold, fontSize: 28, color: COLORS.text, marginTop: 4 },
    postureBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.success + '20', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    postureBadgeText: { ...FONTS.bold, fontSize: 11, color: COLORS.success, marginLeft: 6, letterSpacing: 1 },
    postureMapPlaceholder: { height: 120, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.03)' },
    mapText: { ...FONTS.bold, fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 8, letterSpacing: 2 },
    pulseDot: { position: 'absolute', top: 30, right: 50, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, shadowColor: COLORS.primary, shadowOpacity: 1, shadowRadius: 10, shadowOffset: {width:0, height:0} },
    fleetSummaryRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 20 },
    fleetItem: { alignItems: 'center' },
    fleetVal: { ...FONTS.extraBold, fontSize: 22, color: COLORS.text },
    fleetLabel: { ...FONTS.bold, fontSize: 10, color: COLORS.textMuted, marginTop: 4, letterSpacing: 1 },
    sectionTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16, marginTop: 10 },
    sectionTitle: { ...FONTS.bold, fontSize: 18, color: COLORS.text, letterSpacing: 0.5, marginBottom: 16 },
    seeAll: { ...FONTS.bold, fontSize: 13, color: COLORS.primary, marginBottom: 16 },
    analyticsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
    statCard: { width: '48%', padding: 16, borderRadius: 24, marginBottom: 16 },
    statLabel: { ...FONTS.medium, fontSize: 12, color: COLORS.textSecondary, marginBottom: 8 },
    statValue: { ...FONTS.extraBold, fontSize: 20, color: COLORS.text, marginBottom: 8 },
    trendRow: { flexDirection: 'row', alignItems: 'center' },
    trendText: { ...FONTS.bold, fontSize: 12, marginLeft: 4 },
    nodeCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 24, marginBottom: 16 },
    nodeWarning: { borderColor: COLORS.danger, borderWidth: 1 },
    nodeIconBg: { width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    nodeMiddle: { flex: 1 },
    nodeName: { ...FONTS.bold, fontSize: 16, color: COLORS.text, marginBottom: 4 },
    nodeStatus: { ...FONTS.bold, fontSize: 12, color: COLORS.textSecondary },
    nodeRight: { alignItems: 'flex-end' },
    nodeLoadVal: { ...FONTS.extraBold, fontSize: 20, color: COLORS.text },
    nodeLoadLabel: { ...FONTS.bold, fontSize: 10, color: COLORS.textMuted, marginTop: 2, letterSpacing: 1 },
});