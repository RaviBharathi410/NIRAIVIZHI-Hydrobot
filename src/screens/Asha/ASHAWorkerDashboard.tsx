import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, SPACE, SHADOWS } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import SectionHeader from '../../components/SectionHeader';
import AnimatedButton from '../../components/AnimatedButton';
import SkeletonLoader from '../../components/SkeletonLoader';
import { useLanguage } from '../../context/LanguageContext';

export default function ASHAWorkerDashboard({ navigation }: any) {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const ACTIONS = [
        { title: t('waterTest'), icon: 'test-tube' as const, color: COLORS.info, bg: '#DBEAFE', screen: 'WaterTestForm' },
        { title: t('patientVisits'), icon: 'account-plus-outline' as const, color: COLORS.success, bg: '#DCFCE7', screen: 'PatientVisitsList' },
        { title: t('symptomTrends'), icon: 'chart-bell-curve' as const, color: COLORS.warning, bg: '#FFEDD5', screen: 'SymptomTrends' },
        { title: t('generateReport'), icon: 'file-export-outline' as const, color: COLORS.primary, bg: '#F3E8FF', screen: 'GenerateReport' },
    ];

    if (loading) {
        return (
            <View style={styles.container}>
                <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />
                <View style={styles.skeletonContent}>
                    <SkeletonLoader height={140} borderRadius={25} style={{ marginBottom: 20 }} />
                    <SkeletonLoader height={200} borderRadius={25} style={{ marginBottom: 20 }} />
                    <View style={styles.skGrid}>
                        <SkeletonLoader height={100} width="48%" borderRadius={20} />
                        <SkeletonLoader height={100} width="48%" borderRadius={20} />
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <MotiView
                    from={{ opacity: 0, translateY: -20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    style={styles.header}
                >
                    <View>
                        <Text style={styles.greeting}>{t('goodDay')}</Text>
                        <Text style={styles.userName}>{t('ashaWorkers')}</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.profileBtn}>
                        <LinearGradient colors={GRADIENTS.primary as any} style={styles.profileCircle}>
                            <MaterialCommunityIcons name="cog" size={24} color={COLORS.white} />
                        </LinearGradient>
                    </TouchableOpacity>
                </MotiView>

                <GlassCard style={styles.mainStats} variant="heavy">
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statVal}>24</Text>
                            <Text style={styles.statLabel}>{t('testsDone')}</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statVal}>18</Text>
                            <Text style={styles.statLabel}>{t('patientVisits')}</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statVal, { color: COLORS.danger }]}>3</Text>
                            <Text style={styles.statLabel}>{t('activeAlerts')}</Text>
                        </View>
                    </View>
                </GlassCard>

                <SectionHeader title={t('quickActions')} />
                <View style={styles.actionGrid}>
                    {ACTIONS.map((action, i) => (
                        <MotiView
                            key={action.title}
                            from={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 100, type: 'spring' } as any}
                            style={styles.actionItem}
                        >
                            <TouchableOpacity
                                onPress={() => navigation.navigate(action.screen)}
                                activeOpacity={0.8}
                            >
                                <GlassCard style={[styles.actionCard, { backgroundColor: COLORS.surface }]}>
                                    <View style={[styles.iconContainer, { backgroundColor: (action as any).bg }]}>
                                        <MaterialCommunityIcons name={action.icon as any} size={32} color={action.color} />
                                    </View>
                                    <Text style={styles.actionTitle}>{action.title}</Text>
                                </GlassCard>
                            </TouchableOpacity>
                        </MotiView>
                    ))}
                </View>

                <SectionHeader title={t('analytics')} />
                <GlassCard style={styles.intelligenceCard} variant="elevated">
                    <View style={styles.intelRow}>
                        <MaterialCommunityIcons name="molecule" size={24} color={COLORS.warning} />
                        <View style={styles.intelContent}>
                            <Text style={styles.intelTitle}>Sector 4 - Bacterial Spike</Text>
                            <Text style={styles.intelSub}>3 cases of water-borne symptoms reported in the last 24h. Recommend prioritizing water tests in this lane.</Text>
                        </View>
                    </View>
                    <AnimatedButton
                        title={t('shareWithOfficial')}
                        variant="outline"
                        style={styles.intelBtn}
                        iconRight="chevron-right"
                    />
                </GlassCard>

                <View style={styles.footerInfo}>
                    <Text style={styles.footerText}>Field Diagnostics v4.2 • Sync Status: ACTIVE</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACE[6], paddingTop: 70, paddingBottom: 60 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    greeting: { ...FONTS.medium, fontSize: 16, color: COLORS.textSecondary },
    userName: { ...FONTS.extraBold, fontSize: 28, color: COLORS.text },
    profileBtn: { ...(SHADOWS.glow(COLORS.primary, 15, 0.3) as any) },
    profileCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
    mainStats: { paddingVertical: 24, marginBottom: 20 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
    statItem: { alignItems: 'center' },
    statVal: { ...FONTS.extraBold, fontSize: 28, color: COLORS.text },
    statLabel: { ...FONTS.bold, fontSize: 11, color: COLORS.textMuted, marginTop: 4, textTransform: 'uppercase' },
    statDivider: { width: 1, height: 30, backgroundColor: COLORS.border },
    actionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    actionItem: { width: '48%', marginBottom: 16 },
    actionCard: { padding: 20, alignItems: 'center', height: 140, justifyContent: 'center', borderRadius: 20, borderWidth: 1, borderColor: COLORS.border },
    iconContainer: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    actionTitle: { ...FONTS.bold, fontSize: 13, color: COLORS.text, marginTop: 4, textAlign: 'center' },
    intelligenceCard: { padding: 16, marginTop: 10 },
    intelRow: { flexDirection: 'row', alignItems: 'flex-start' },
    intelContent: { flex: 1, marginLeft: 16 },
    intelTitle: { ...FONTS.bold, fontSize: 16, color: COLORS.warning },
    intelSub: { ...FONTS.medium, fontSize: 13, color: COLORS.textSecondary, marginTop: 4, lineHeight: 20 },
    intelBtn: { marginTop: 16 },
    footerInfo: { marginTop: 30, alignItems: 'center', opacity: 0.5 },
    footerText: { ...FONTS.bold, fontSize: 10, color: COLORS.textMuted, letterSpacing: 1 },
    skeletonContent: { padding: SPACE[6], paddingTop: 100 },
    skGrid: { flexDirection: 'row', justifyContent: 'space-between' },
});
