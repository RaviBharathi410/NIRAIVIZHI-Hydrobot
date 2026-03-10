import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, SPACE, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import apiService from '../../services/api';
import GlassCard from '../../components/GlassCard';
import IconBadge from '../../components/IconBadge';
import HeaderActions from '../../components/HeaderActions';
import SectionHeader from '../../components/SectionHeader';
import SkeletonLoader from '../../components/SkeletonLoader';
import WaterQualityHUD from '../../components/WaterQualityHUD';
import AIVisionHUD from '../../components/AIVisionHUD';
import Robot3D from '../../components/animations/Robot3D';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OptimusXStackParamList } from '../../navigation/OptimusXStack';

type Props = NativeStackScreenProps<OptimusXStackParamList, 'Home'>;

export default function OptimusXHomePage({ navigation }: Props) {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [sensorData, setSensorData] = useState<any>(null);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [fleet, setFleet] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            const [sensor, alertList, bots] = await Promise.all([
                apiService.getWaterQuality(),
                apiService.getAlerts(),
                apiService.getBotFleet(),
            ]);
            setSensorData(sensor);
            setAlerts(alertList);
            setFleet(bots);
        } catch (error) {
            console.error('Data load failed', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const activeBots = fleet.filter(b => b.status === 'active').length;

    const QUICK_ACTIONS = [
        { title: t('tds'), icon: 'water-percent', screen: 'TDSTesting', color: '#0284C7' },
        { title: t('ph'), icon: 'test-tube', screen: 'PHTesting', color: '#10B981' },
        { title: t('turbidity'), icon: 'waves', screen: 'TurbidityTesting', color: COLORS.primary },
        { title: t('fleetManagement'), icon: 'robot', screen: 'FleetManagement', color: '#4F46E5' },
        { title: t('aiVision'), icon: 'eye-outline', screen: 'AIVision', color: '#0891B2' },
        { title: t('smartCharging'), icon: 'lightning-bolt', screen: 'SmartCharging', color: '#F59E0B' },
        { title: t('gasSensing'), icon: 'molecule', screen: 'GasSensing', color: '#EF4444' },
        { title: t('trashAnalytics'), icon: 'recycle', screen: 'LiveTrashAnalytics', color: '#059669' },
        { title: t('floodRisk'), icon: 'weather-pouring', screen: 'FloodRiskAlert', color: '#DC2626' },
    ] as const;

    const renderSkeleton = () => (
        <View style={styles.skeletonContainer}>
            <SkeletonLoader height={140} borderRadius={24} style={{ marginBottom: 20 }} />
            <SkeletonLoader height={30} width="50%" style={{ marginBottom: 16 }} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <SkeletonLoader height={160} width={160} borderRadius={22} style={{ marginRight: 12 }} />
                <SkeletonLoader height={160} width={160} borderRadius={22} style={{ marginRight: 12 }} />
            </ScrollView>
            <SkeletonLoader height={30} width="40%" style={{ marginVertical: 24 }} />
            <View style={styles.actionGridSkeleton}>
                {[...Array(6)].map((_, i) => (
                    <SkeletonLoader key={i} height={80} width="30%" borderRadius={16} style={{ marginBottom: 16 }} />
                ))}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['left', 'right']}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                stickyHeaderIndices={[0]}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={COLORS.accent}
                        progressBackgroundColor={COLORS.background as string}
                    />
                }
            >
                <View style={styles.header}>
                    <BlurView intensity={30} tint="light" style={styles.headerBlur}>
                        <View style={styles.headerRow}>
                            <View>
                                <Text style={styles.greeting}>Welcome, {user?.name || 'Explorer'}</Text>
                                <Text style={styles.headerTitle}>Optimus Dashboard</Text>
                            </View>
                            <HeaderActions />
                        </View>
                    </BlurView>
                </View>

                <AnimatePresence exitBeforeEnter>
                    {loading ? (
                        <MotiView
                            key="skeleton"
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {renderSkeleton()}
                        </MotiView>
                    ) : (
                        <MotiView
                            key="content"
                            from={{ opacity: 0, translateY: 20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ type: 'spring', damping: 20 } as any}
                        >
                            <View style={styles.innerContent}>
                                <View style={styles.animationContainer}>
                                    <Robot3D />
                                </View>

                                <SectionHeader title="AI Navigation & Vision" />
                                <AIVisionHUD />

                                <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('FleetManagement')}>
                                    <GlassCard style={styles.fleetCard} variant="heavy">
                                        <LinearGradient
                                            colors={[COLORS.primary + '30', 'transparent']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={StyleSheet.absoluteFill}
                                        />
                                        <View style={styles.fleetRow}>
                                            <IconBadge icon="robot-industrial" size={60} color={COLORS.accent} />
                                            <View style={styles.fleetInfo}>
                                                <Text style={styles.fleetTitle}>HydroBot Fleet</Text>
                                                <View style={styles.activeRow}>
                                                    <View style={styles.statusDot} />
                                                    <Text style={styles.fleetSub}>{activeBots} active units patrolling</Text>
                                                </View>
                                            </View>
                                            <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.textMuted} />
                                        </View>
                                    </GlassCard>
                                </TouchableOpacity>

                                <SectionHeader title={t('waterQuality')} />
                                <WaterQualityHUD />

                                <AnimatePresence>
                                    {alerts.length > 0 && (
                                        <MotiView
                                            from={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            style={styles.alertSection}
                                        >
                                            <SectionHeader title="Priority Alerts" />
                                            {alerts.slice(0, 2).map((alert, i) => (
                                                <GlassCard
                                                    key={alert.id}
                                                    style={styles.alertCard}
                                                    variant="elevated"
                                                >
                                                    <View style={styles.alertRow}>
                                                        <View style={[styles.alertBar, { backgroundColor: alert.type === 'danger' ? COLORS.danger : COLORS.warning }]} />
                                                        <MaterialCommunityIcons
                                                            name={alert.type === 'danger' ? "alert-octagon" : "alert-circle"}
                                                            size={24}
                                                            color={alert.type === 'danger' ? COLORS.danger : COLORS.warning}
                                                        />
                                                        <View style={styles.alertTextWrapper}>
                                                            <Text style={styles.alertText} numberOfLines={2}>{alert.message}</Text>
                                                            <Text style={styles.alertTime}>{alert.time}</Text>
                                                        </View>
                                                    </View>
                                                </GlassCard>
                                            ))}
                                        </MotiView>
                                    )}
                                </AnimatePresence>

                                <SectionHeader title="Control Hub" />
                                <View style={styles.actionGrid}>
                                    {QUICK_ACTIONS.map((action, i) => (
                                        <MotiView
                                            key={action.screen}
                                            from={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: i * 50, type: 'spring' } as any}
                                            style={styles.actionItem}
                                        >
                                            <TouchableOpacity
                                                style={styles.actionCard}
                                                onPress={() => navigation.navigate(action.screen as any)}
                                                activeOpacity={0.7}
                                            >
                                                <IconBadge icon={action.icon as any} size={54} color={action.color} glow />
                                                <Text style={styles.actionLabel} numberOfLines={2}>{action.title}</Text>
                                            </TouchableOpacity>
                                        </MotiView>
                                    ))}
                                </View>

                                <View style={styles.extraLinks}>
                                    <TouchableOpacity style={styles.extraBtn} onPress={() => navigation.navigate('JudgesFAQ')}>
                                        <GlassCard style={styles.miniBtn}>
                                            <MaterialCommunityIcons name="frequently-asked-questions" size={24} color={COLORS.accent} />
                                            <Text style={styles.miniBtnText}>Judges FAQ</Text>
                                        </GlassCard>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.extraBtn} onPress={() => navigation.navigate('Contact')}>
                                        <GlassCard style={styles.miniBtn}>
                                            <MaterialCommunityIcons name="face-agent" size={24} color={COLORS.accent} />
                                            <Text style={styles.miniBtnText}>{t('contact')}</Text>
                                        </GlassCard>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </MotiView>
                    )}
                </AnimatePresence>
            </ScrollView>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { paddingBottom: 100 },
    animationContainer: { height: 180, width: '100%', borderRadius: 24, overflow: 'hidden', marginBottom: SPACE[6] },
    skeletonContainer: { padding: SPACE[6] },
    actionGridSkeleton: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    header: { zIndex: 100 },
    headerBlur: {
        paddingTop: Platform.OS === 'ios' ? 10 : 20,
        paddingBottom: 20,
        paddingHorizontal: SPACE[6],
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    greeting: { ...FONTS.medium, fontSize: 13, color: COLORS.textSecondary, letterSpacing: 0.5 },
    headerTitle: { ...FONTS.bold, fontSize: 26, color: COLORS.text, marginTop: 2 },
    profileBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        overflow: 'hidden',
        ...(SHADOWS.glow(COLORS.primary, 10, 0.2) as any),
    },
    profileGlow: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    innerContent: { paddingHorizontal: SPACE[6], paddingTop: 10 },
    fleetCard: { marginBottom: SPACE[6] },
    fleetRow: { flexDirection: 'row', alignItems: 'center', padding: 4 },
    fleetInfo: { flex: 1, marginLeft: 16 },
    fleetTitle: { ...FONTS.bold, fontSize: 18, color: COLORS.text },
    activeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.success, marginRight: 6 },
    fleetSub: { ...FONTS.medium, fontSize: 13, color: COLORS.textSecondary },
    alertSection: { marginBottom: SPACE[4] },
    alertCard: { padding: 0, marginBottom: 8, overflow: 'hidden' },
    alertRow: { flexDirection: 'row', alignItems: 'center', padding: 12 },
    alertBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
    alertTextWrapper: { flex: 1, marginLeft: 12 },
    alertText: { ...FONTS.semiBold, fontSize: 14, color: COLORS.text },
    alertTime: { ...FONTS.regular, fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
    actionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 8 },
    actionItem: { width: '30%', marginBottom: 20 },
    actionCard: { alignItems: 'center' },
    actionLabel: { ...FONTS.medium, fontSize: 11, color: COLORS.textSecondary, textAlign: 'center', marginTop: 8 },
    extraLinks: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
    extraBtn: { width: '48%' },
    miniBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },
    miniBtnText: { ...FONTS.semiBold, fontSize: 13, color: COLORS.text, marginLeft: 8 },
});