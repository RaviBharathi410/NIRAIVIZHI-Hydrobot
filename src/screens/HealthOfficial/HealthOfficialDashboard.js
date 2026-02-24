import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, GRADIENTS, SPACE, SHADOWS } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import SectionHeader from '../../components/SectionHeader';
import SimpleChart from '../../components/charts/SimpleChart';
import IconBadge from '../../components/IconBadge';

import { useLanguage } from '../../context/LanguageContext';

export default function HealthOfficialDashboard({ navigation }) {
    const { t } = useLanguage();
    const REGION_STATS = [
        { name: 'North Village', safety: 92, alerts: 0, color: COLORS.success },
        { name: 'East Delta', safety: 84, alerts: 1, color: COLORS.warning },
        { name: 'West Bank', safety: 68, alerts: 3, color: COLORS.danger },
    ];

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }} style={styles.header}>
                    <Text style={styles.title}>{t('healthOfficialDashboard')}</Text>
                    <Text style={styles.subtitle}>{t('districtWaterQuality')}</Text>
                </MotiView>

                <SectionHeader title={t('villageSummary')} />
                {REGION_STATS.map((region, i) => (
                    <MotiView
                        key={region.name}
                        from={{ opacity: 0, translateX: -20 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        transition={{ delay: i * 150 }}
                    >
                        <GlassCard style={styles.regionCard}>
                            <View style={styles.regionRow}>
                                <View style={styles.regionInfo}>
                                    <Text style={styles.regionName}>{region.name}</Text>
                                    <Text style={styles.regionSub}>{region.alerts} Critical Alerts Active</Text>
                                </View>
                                <View style={styles.regionMetric}>
                                    <Text style={[styles.regionVal, { color: region.color }]}>{region.safety}%</Text>
                                    <Text style={styles.regionUnit}>{t('safe')}</Text>
                                </View>
                            </View>
                            <View style={styles.progressTrack}>
                                <MotiView
                                    from={{ width: '0%' }}
                                    animate={{ width: `${region.safety}%` }}
                                    style={[styles.progressFill, { backgroundColor: region.color }]}
                                />
                            </View>
                        </GlassCard>
                    </MotiView>
                ))}

                <SectionHeader title={t('waterBorneTrend')} />
                <GlassCard style={styles.chartCard} variant="heavy">
                    <SimpleChart
                        data={[12, 18, 14, 25, 30, 22, 15]}
                        labels={['M', 'T', 'W', 'T', 'F', 'S', 'S']}
                        color={COLORS.danger}
                        height={150}
                        title="Contamination Frequency Index"
                    />
                </GlassCard>

                <View style={styles.actionRow}>
                    <GlassCard style={styles.actionCard}>
                        <IconBadge icon="file-document-outline" size={32} color={COLORS.primary} />
                        <Text style={styles.actionText}>{t('generateReport')}</Text>
                    </GlassCard>
                    <GlassCard style={styles.actionCard}>
                        <IconBadge icon="map-marker-radius" size={32} color={COLORS.accent} />
                        <Text style={styles.actionText}>Geofence Setup</Text>
                    </GlassCard>
                </View>

                <TouchableOpacity
                    style={styles.logoutBtn}
                    onPress={() => navigation.navigate('Logout')}
                >
                    <Text style={styles.logoutText}>{t('logout')}</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACE[6], paddingTop: 80, paddingBottom: 60 },
    header: { marginBottom: 30 },
    title: { ...FONTS.extraBold, fontSize: 32, color: COLORS.text },
    subtitle: { ...FONTS.medium, fontSize: 16, color: COLORS.textSecondary },
    regionCard: { marginBottom: 16, padding: 16 },
    regionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    regionName: { ...FONTS.bold, fontSize: 18, color: COLORS.text },
    regionSub: { ...FONTS.medium, fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
    regionMetric: { alignItems: 'flex-end' },
    regionVal: { ...FONTS.extraBold, fontSize: 24 },
    regionUnit: { ...FONTS.bold, fontSize: 9, color: COLORS.textMuted },
    progressTrack: { height: 4, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 2 },
    chartCard: { padding: 16, marginBottom: 24 },
    actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
    actionCard: { width: '48%', alignItems: 'center', paddingVertical: 20 },
    actionText: { ...FONTS.bold, fontSize: 12, color: COLORS.text, marginTop: 12 },
    logoutBtn: { alignItems: 'center', marginTop: 10, opacity: 0.6 },
    logoutText: { ...FONTS.bold, fontSize: 10, color: COLORS.danger, letterSpacing: 2 },
});