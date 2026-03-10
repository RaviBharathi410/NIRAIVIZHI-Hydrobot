import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, SPACE, SHADOWS } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import ScreenHeader from '../../components/ScreenHeader';
import SectionHeader from '../../components/SectionHeader';
import AnimatedButton from '../../components/AnimatedButton';
import SkeletonLoader from '../../components/SkeletonLoader';
import { useLanguage } from '../../context/LanguageContext';

export default function ASHAWorkerDashboard({ navigation }: any) {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1500);
    };

    const ACTIONS = [
        { title: t('waterTest') || 'Water Test', icon: 'test-tube' as const, color: COLORS.info, bg: '#DBEAFE', screen: 'WaterTestForm' },
        { title: t('patientVisits') || 'Patient Visits', icon: 'account-multiple-outline' as const, color: COLORS.success, bg: '#DCFCE7', screen: 'PatientVisitsList' },
        { title: 'Patient Entry', icon: 'account-plus' as const, color: COLORS.primary, bg: '#E0E7FF', screen: 'PatientEntry' },
        { title: 'AI Diagnosis', icon: 'brain' as const, color: '#A78BFA', bg: '#F3E8FF', screen: 'MLSymptoms' },
        { title: t('symptomTrends') || 'Health Trends', icon: 'chart-bell-curve' as const, color: COLORS.warning, bg: '#FFEDD5', screen: 'SymptomTrends' },
        { title: t('generateReport') || 'Reports', icon: 'file-export-outline' as const, color: COLORS.primary, bg: '#F1F5F9', screen: 'GenerateReport' },
    ];

    if (loading) {
        return (
            <View style={styles.container}>
                <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />
                <View style={styles.skeletonContent}>
                    <SkeletonLoader height={60} width="60%" style={{ marginBottom: 30 }} />
                    <SkeletonLoader height={140} borderRadius={25} style={{ marginBottom: 20 }} />
                    <SkeletonLoader height={200} borderRadius={25} style={{ marginBottom: 20 }} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
                }
            >
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <ScreenHeader
                        title={t('ashaWorkers') || 'ASHA Portal'}
                        subtitle={t('goodDay') || 'Community Health Dashboard'}
                        showBack={false}
                    />
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <GlassCard style={styles.mainStats} variant="heavy">
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statVal}>24</Text>
                                <Text style={styles.statLabel}>{t('testsDone') || 'TESTS'}</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statVal}>18</Text>
                                <Text style={styles.statLabel}>{t('patientVisits') || 'VISITS'}</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={[styles.statVal, { color: COLORS.danger }]}>3</Text>
                                <Text style={styles.statLabel}>{t('activeAlerts') || 'ALERTS'}</Text>
                            </View>
                        </View>
                    </GlassCard>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(300).springify()}>
                    <SectionHeader title={t('quickActions') || 'Field Actions'} />
                    <View style={styles.actionGrid}>
                        {ACTIONS.map((action, i) => (
                            <TouchableOpacity
                                key={action.title}
                                onPress={() => navigation.navigate(action.screen)}
                                activeOpacity={0.8}
                                style={styles.actionItem}
                            >
                                <Animated.View entering={FadeInDown.delay(400 + i * 50).springify()}>
                                    <GlassCard style={styles.actionCard} variant="elevated">
                                        <View style={[styles.iconContainer, { backgroundColor: (action as any).bg }]}>
                                            <MaterialCommunityIcons name={action.icon as any} size={28} color={action.color} />
                                        </View>
                                        <Text style={styles.actionTitle}>{action.title}</Text>
                                    </GlassCard>
                                </Animated.View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(700).springify()}>
                    <SectionHeader title={t('intelligence') || 'Sector Intelligence'} />
                    <GlassCard style={styles.intelligenceCard} variant="heavy">
                        <View style={styles.intelHeader}>
                            <View style={[styles.intelIcon, { backgroundColor: COLORS.warning + '20' }]}>
                                <MaterialCommunityIcons name="molecule" size={24} color={COLORS.warning} />
                            </View>
                            <View style={styles.intelHeaderText}>
                                <Text style={styles.intelTitle}>Sector 4 - Bacterial Spike</Text>
                                <Text style={styles.intelTime}>24h Activity</Text>
                            </View>
                        </View>
                        <Text style={styles.intelSub}>
                            3 cases of water-borne symptoms reported in the last 24h. Regional data suggests a correlation with recent pipeline maintenance.
                        </Text>
                        <View style={styles.intelActions}>
                            <TouchableOpacity style={styles.intelActionBtn}>
                                <MaterialCommunityIcons name="share-variant-outline" size={20} color={COLORS.primary} />
                                <Text style={styles.intelActionText}>Share with Official</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.intelActionBtn, styles.intelActionBtnPrimary]}>
                                <Text style={[styles.intelActionText, { color: 'white' }]}>Run Deep Analysis</Text>
                            </TouchableOpacity>
                        </View>
                    </GlassCard>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(900).springify()}>
                    <View style={styles.footerInfo}>
                        <Text style={styles.footerText}>Field Diagnostics v4.2 • Sync Status: ACTIVE</Text>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scrollContent: { padding: SPACE[6], paddingTop: 10, paddingBottom: 60 },
    mainStats: { paddingVertical: 24, marginBottom: 20, borderRadius: 24 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
    statItem: { alignItems: 'center' },
    statVal: { ...FONTS.extraBold, fontSize: 32, color: COLORS.text },
    statLabel: { ...FONTS.bold, fontSize: 10, color: COLORS.textMuted, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 },
    statDivider: { width: 1, height: 30, backgroundColor: COLORS.border },
    actionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    actionItem: { width: '48%', marginBottom: 16 },
    actionCard: { padding: 18, alignItems: 'center', height: 130, justifyContent: 'center', borderRadius: 22 },
    iconContainer: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    actionTitle: { ...FONTS.bold, fontSize: 14, color: COLORS.text, marginTop: 2, textAlign: 'center' },
    intelligenceCard: { padding: 20, marginTop: 4, borderRadius: 24 },
    intelHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    intelIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    intelHeaderText: { marginLeft: 14 },
    intelTitle: { ...FONTS.bold, fontSize: 17, color: COLORS.warning },
    intelTime: { ...FONTS.medium, fontSize: 12, color: COLORS.textMuted },
    intelSub: { ...FONTS.medium, fontSize: 14, color: COLORS.textSecondary, lineHeight: 22, marginBottom: 20 },
    intelActions: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
    intelActionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.surfaceLight, paddingVertical: 12, borderRadius: 12, gap: 6 },
    intelActionBtnPrimary: { backgroundColor: COLORS.primary },
    intelActionText: { ...FONTS.bold, fontSize: 13, color: COLORS.primary },
    footerInfo: { marginTop: 40, alignItems: 'center', opacity: 0.6 },
    footerText: { ...FONTS.bold, fontSize: 10, color: COLORS.textMuted, letterSpacing: 1.5, textTransform: 'uppercase' },
    skeletonContent: { padding: SPACE[6], paddingTop: 60 },
});
