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

import { useLanguage } from '../../context/LanguageContext';

export default function VillageLeaderDashboard({ navigation }: any) {
    const { t } = useLanguage();
    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <ScreenHeader
                    title={t('communityDashboard')}
                    subtitle={t('villageSummary')}
                    showBack={false}
                />

                <SectionHeader title={t('fleetStatus')} />
                <View style={styles.summaryGrid}>
                    <GlassCard style={styles.summaryCard}>
                        <IconBadge icon="robot-industrial" size={32} color={COLORS.primary} />
                        <Text style={styles.sVal}>12</Text>
                        <Text style={styles.sLabel}>{t('botsActive')}</Text>
                    </GlassCard>
                    <GlassCard style={styles.summaryCard}>
                        <IconBadge icon="water-pump" size={32} color={COLORS.accent} />
                        <Text style={styles.sVal}>96%</Text>
                        <Text style={styles.sLabel}>Filtration Efficiency</Text>
                    </GlassCard>
                </View>

                <SectionHeader title={t('recentAlerts')} />
                <GlassCard style={styles.alertCard} variant="elevated">
                    <View style={styles.alertRow}>
                        <MaterialCommunityIcons name="alert-octagon" size={32} color={COLORS.danger} />
                        <View style={styles.alertInfo}>
                            <Text style={styles.alertTitle}>Sedimentation Warning</Text>
                            <Text style={styles.alertDesc}>High turbidity detected near Sector 2. Review automated bot rerouting logs.</Text>
                        </View>
                    </View>
                    <AnimatedButton title={t('seeAll')} variant="primary" style={[styles.alertBtn, { backgroundColor: COLORS.danger }]} />
                </GlassCard>

                <SectionHeader title="Resource Allocation" />
                <GlassCard>
                    <View style={styles.resourceRow}>
                        <View style={styles.resItem}>
                            <Text style={styles.resLabel}>Budget Used</Text>
                            <Text style={styles.resVal}>₹42.5k</Text>
                        </View>
                        <View style={styles.resDivider} />
                        <View style={styles.resItem}>
                            <Text style={styles.resLabel}>Energy Cost</Text>
                            <Text style={styles.resVal}>84 kWh</Text>
                        </View>
                    </View>
                </GlassCard>


            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scrollContent: { padding: SPACE[6], paddingTop: 20, paddingBottom: 60 },
    header: { marginBottom: 30 },
    title: { ...FONTS.extraBold, fontSize: 32, color: (COLORS as any).text },
    subtitle: { ...FONTS.medium, fontSize: 16, color: COLORS.textSecondary },
    summaryGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    summaryCard: { width: '48%', alignItems: 'center', paddingVertical: 20 },
    sVal: { ...FONTS.bold, fontSize: 24, color: COLORS.primary, marginTop: 10 },
    sLabel: { ...FONTS.medium, fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
    alertCard: { padding: 20, marginBottom: 24 },
    alertRow: { flexDirection: 'row', alignItems: 'center' },
    alertInfo: { flex: 1, marginLeft: 16 },
    alertTitle: { ...FONTS.bold, fontSize: 18, color: COLORS.danger },
    alertDesc: { ...FONTS.medium, fontSize: 14, color: COLORS.textSecondary, marginTop: 4, lineHeight: 20 },
    alertBtn: { marginTop: 20 },
    resourceRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 },
    resItem: { alignItems: 'center' },
    resLabel: { ...FONTS.bold, fontSize: 10, color: COLORS.textMuted, marginBottom: 6, textTransform: 'uppercase' },
    resVal: { ...FONTS.bold, fontSize: 20, color: (COLORS as any).text },
    resDivider: { width: 1, height: '80%', backgroundColor: COLORS.border },
    logoutBtn: { alignItems: 'center', marginTop: 40, opacity: 0.5 },
    logoutText: { ...FONTS.bold, fontSize: 10, color: COLORS.textMuted, letterSpacing: 3 },
});