import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, SPACE } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import SectionHeader from '../../components/SectionHeader';
import SimpleChart from '../../components/charts/SimpleChart';
import IconBadge from '../../components/IconBadge';

export default function PredictiveAnalyticsScreen() {
    const TREND_DATA = [45, 52, 48, 70, 65, 80, 75];

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }}>
                    <Text style={styles.title}>AI Foresight</Text>
                    <Text style={styles.subtitle}>Deep Learning Powered Predictive Modeling</Text>
                </MotiView>

                <SectionHeader title="7-Day Water Quality Forecast" />
                <GlassCard style={styles.chartCard} variant="heavy">
                    <SimpleChart
                        data={TREND_DATA}
                        labels={['M', 'T', 'W', 'T', 'F', 'S', 'S']}
                        color={COLORS.primary}
                        height={200}
                        title="Stability Probability Index"
                    />
                    <View style={styles.chartLegend}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
                            <Text style={styles.legendText}>Predicted Trend</Text>
                        </View>
                        <Text style={styles.confidence}>Confidence: 94%</Text>
                    </View>
                </GlassCard>

                <SectionHeader title="Event Predictions" />
                <GlassCard style={styles.eventCard}>
                    <View style={styles.eventRow}>
                        <IconBadge icon="water-alert-outline" size={40} color={COLORS.warning} />
                        <View style={styles.eventInfo}>
                            <Text style={styles.eventTitle}>Hyacinth Bloom Surge</Text>
                            <Text style={styles.eventSub}>Predicted in 4 days near Sector 2 Inlet</Text>
                        </View>
                    </View>
                    <View style={styles.eventProgress}>
                        <Text style={styles.progLabel}>Risk Level</Text>
                        <View style={styles.progTrack}>
                            <MotiView
                                from={{ width: '0%' }}
                                animate={{ width: '75%' }}
                                transition={{ type: 'timing', duration: 1000 } as any}
                                style={[styles.progFill, { backgroundColor: COLORS.warning }]}
                            />
                        </View>
                    </View>
                </GlassCard>

                <SectionHeader title="System Suggestions" />
                <View style={styles.suggestGrid}>
                    <GlassCard style={styles.suggestCard}>
                        <MaterialCommunityIcons name="cog-refresh-outline" size={24} color={COLORS.accent} />
                        <Text style={styles.suggestText}>Advance Bot Maintenance schedule to tomorrow.</Text>
                    </GlassCard>
                    <GlassCard style={styles.suggestCard}>
                        <MaterialCommunityIcons name="battery-check-outline" size={24} color={COLORS.success} />
                        <Text style={styles.suggestText}>Optimize charge cycles for predicted rainfall.</Text>
                    </GlassCard>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACE[6], paddingTop: 80, paddingBottom: 60 },
    title: { ...FONTS.extraBold, fontSize: 32, color: COLORS.white },
    subtitle: { ...FONTS.medium, fontSize: 16, color: COLORS.textSecondary, marginBottom: SPACE[6] },
    chartCard: { padding: 16, marginBottom: 24 },
    chartLegend: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, paddingHorizontal: 10 },
    legendItem: { flexDirection: 'row', alignItems: 'center' },
    legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
    legendText: { ...FONTS.medium, fontSize: 12, color: COLORS.textSecondary },
    confidence: { ...FONTS.bold, fontSize: 12, color: COLORS.success },
    eventCard: { padding: 16, marginBottom: 24 },
    eventRow: { flexDirection: 'row', alignItems: 'center' },
    eventInfo: { flex: 1, marginLeft: 16 },
    eventTitle: { ...FONTS.bold, fontSize: 16, color: COLORS.white },
    eventSub: { ...FONTS.medium, fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
    eventProgress: { marginTop: 20 },
    progLabel: { ...FONTS.bold, fontSize: 10, color: COLORS.textMuted, marginBottom: 8, textTransform: 'uppercase' },
    progTrack: { height: 4, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' },
    progFill: { height: '100%', borderRadius: 2 },
    suggestGrid: { flexDirection: 'row', justifyContent: 'space-between' },
    suggestCard: { width: '48%', padding: 16, alignItems: 'center' },
    suggestText: { ...FONTS.medium, fontSize: 12, color: COLORS.textSecondary, marginTop: 12, textAlign: 'center', lineHeight: 18 },
});