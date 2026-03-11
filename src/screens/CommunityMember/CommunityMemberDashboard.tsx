import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, SPACE } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import SectionHeader from '../../components/SectionHeader';
import IconBadge from '../../components/IconBadge';
import AnimatedButton from '../../components/AnimatedButton';
import ScreenHeader from '../../components/ScreenHeader';
import { useRobotStore } from '../../store/useRobotStore';
import { useAlertStore } from '../../store/useAlertStore';
import { useLanguage } from '../../context/LanguageContext';

export default function CommunityMemberDashboard({ navigation }: any) {
    const { t } = useLanguage();
    const robots = useRobotStore(state => state.robots);
    const missionStats = useRobotStore(state => state.missionStats);
    const addAlert = useAlertStore(state => state.addAlert);

    // Simulation: Nearest bot is always robot '1' if online
    const nearestBot = robots.find(r => r.id === '1') || robots[0];
    const isWaterSafe = (nearestBot?.telemetry.ph || 7) >= 6.5 && (nearestBot?.telemetry.ph || 7) <= 8.5 && (nearestBot?.telemetry.tds || 0) < 300;

    const handleReportIssue = () => {
        addAlert({
            severity: 'critical',
            title: 'Citizen Report: Water Issue',
            message: 'A community member has reported unusual odor/color near Sector D. Dispatching nearest unit for verification.',
            robotId: nearestBot?.id
        });
        alert('Thank you! Your report has been sent to the sanitation team.');
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <ScreenHeader
                    title="Citizen Portal"
                    subtitle="Namaste, Welcome back"
                    showBack={false}
                />

                <GlassCard style={styles.heroCard} variant="heavy">
                    <View style={styles.heroRow}>
                        <IconBadge
                            icon={isWaterSafe ? "water-check" : "water-alert"}
                            size={70}
                            color={isWaterSafe ? COLORS.success : COLORS.danger}
                            glow
                        />
                        <View style={styles.heroInfo}>
                            <Text style={[styles.heroStatus, !isWaterSafe && { color: COLORS.danger }]}>
                                {isWaterSafe ? 'YOUR WATER IS SAFE' : 'TAP WATER ADVISORY'}
                            </Text>
                            <Text style={styles.heroSub}>
                                {isWaterSafe
                                    ? `Verified by ${nearestBot?.name || 'HydroBot System'}`
                                    : 'Anomalies detected. Boiling recommended.'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.heroMetrics}>
                        <View style={styles.hMetric}>
                            <Text style={styles.hVal}>{nearestBot?.telemetry.tds || '--'}</Text>
                            <Text style={styles.hLabel}>TDS</Text>
                        </View>
                        <View style={styles.hDivider} />
                        <View style={styles.hMetric}>
                            <Text style={styles.hVal}>{nearestBot?.telemetry.ph || '--'}</Text>
                            <Text style={styles.hLabel}>pH</Text>
                        </View>
                    </View>
                </GlassCard>

                <SectionHeader title="Community News" />
                <GlassCard style={styles.newsCard}>
                    <Text style={styles.newsTitle}>Report Local Issues</Text>
                    <Text style={styles.newsDesc}>Noticed a leak or unusual water color in your pipe? Report it immediately to the ASHA team.</Text>
                    <AnimatedButton
                        title="Report Now"
                        variant="primary"
                        style={[styles.newsBtn, { backgroundColor: COLORS.danger }]}
                        onPress={handleReportIssue}
                    />
                </GlassCard>

                <SectionHeader title="My Environment" />
                <View style={styles.envGrid}>
                    <GlassCard style={styles.envCard}>
                        <MaterialCommunityIcons name="trash-can-outline" size={32} color={COLORS.success} />
                        <Text style={styles.envVal}>{Math.floor(missionStats.totalTrash)}</Text>
                        <Text style={styles.envLabel}>Kgs Trash Removed</Text>
                    </GlassCard>
                    <GlassCard style={styles.envCard}>
                        <MaterialCommunityIcons name="water-percent" size={32} color={COLORS.primary} />
                        <Text style={styles.envVal}>{nearestBot?.status === 'ONLINE' ? '98%' : 'OFFLINE'}</Text>
                        <Text style={styles.envLabel}>System Online</Text>
                    </GlassCard>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    scrollContent: { padding: SPACE[6], paddingTop: 20, paddingBottom: 60 },
    header: { marginBottom: 30 },
    greeting: { ...FONTS.medium, fontSize: 18, color: COLORS.textSecondary },
    userName: { ...FONTS.extraBold, fontSize: 32, color: COLORS.text },
    heroCard: { padding: 24, marginBottom: 24, overflow: 'hidden' },
    heroRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
    heroInfo: { flex: 1, marginLeft: 20 },
    heroStatus: { ...FONTS.extraBold, fontSize: 20, color: COLORS.success },
    heroSub: { ...FONTS.medium, fontSize: 13, color: COLORS.textSecondary, marginTop: 4, lineHeight: 18 },
    heroMetrics: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 20 },
    hMetric: { flex: 1, alignItems: 'center' },
    hVal: { ...FONTS.bold, fontSize: 22, color: COLORS.text },
    hLabel: { ...FONTS.bold, fontSize: 10, color: COLORS.textMuted, marginTop: 4, letterSpacing: 1 },
    hDivider: { width: 1, height: '80%', backgroundColor: COLORS.border },
    newsCard: { padding: 20, marginBottom: 20, backgroundColor: (COLORS as any).surface },
    newsTitle: { ...FONTS.bold, fontSize: 18, color: COLORS.text },
    newsDesc: { ...FONTS.medium, fontSize: 14, color: COLORS.textSecondary, marginTop: 8, lineHeight: 22 },
    newsBtn: { marginTop: 16 },
    envGrid: { flexDirection: 'row', justifyContent: 'space-between' },
    envCard: { width: '48%', alignItems: 'center', paddingVertical: 20 },
    envVal: { ...FONTS.bold, fontSize: 20, color: COLORS.text, marginTop: 10 },
    envLabel: { ...FONTS.medium, fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
    exitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 40, opacity: 0.5 },
    exitText: { ...FONTS.bold, fontSize: 12, color: COLORS.textMuted, marginLeft: 10, letterSpacing: 2 },
});