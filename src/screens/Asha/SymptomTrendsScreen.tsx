import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, SPACE } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import SectionHeader from '../../components/SectionHeader';
import SimpleChart from '../../components/charts/SimpleChart';

export default function SymptomTrendsScreen() {
    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }}>
                    <Text style={styles.title}>Health Trends</Text>
                    <Text style={styles.subtitle}>Disease Analytics & Early Outbreak Detection</Text>
                </MotiView>

                <SectionHeader title="Symptom Frequency" />
                <GlassCard style={styles.chartCard} variant="heavy">
                    <SimpleChart
                        data={[5, 12, 28, 18, 10, 8, 4]}
                        labels={['M', 'T', 'W', 'T', 'F', 'S', 'S']}
                        color={COLORS.danger}
                        height={180}
                        title="Diarrheal Incident Index"
                    />
                    <View style={styles.chartMeta}>
                        <MaterialCommunityIcons name="trending-up" size={18} color={COLORS.danger} />
                        <Text style={styles.metaText}>32% Increase from previous week</Text>
                    </View>
                </GlassCard>

                <SectionHeader title="Geographical Hotspots" />
                <View style={styles.hotspotGrid}>
                    <GlassCard style={styles.hotspotCard}>
                        <Text style={styles.hVal}>Sector 4</Text>
                        <Text style={styles.hLabel}>PRIMARY HOTSPOT</Text>
                        <View style={styles.hRadar}>
                            <MotiView
                                from={{ scale: 0.5, opacity: 0.5 }}
                                animate={{ scale: 1.5, opacity: 0 }}
                                transition={{ loop: true, duration: 2000 } as any}
                                style={[styles.radarCircle, { backgroundColor: COLORS.danger }]}
                            />
                            <MaterialCommunityIcons name="map-marker-alert" size={24} color={COLORS.danger} />
                        </View>
                    </GlassCard>
                    <GlassCard style={styles.hotspotCard}>
                        <Text style={styles.hVal}>North Inlet</Text>
                        <Text style={styles.hLabel}>MODERATE RISK</Text>
                        <View style={styles.hRadar}>
                            <MaterialCommunityIcons name="shield-check-outline" size={24} color={COLORS.success} />
                        </View>
                    </GlassCard>
                </View>

                <GlassCard style={styles.summaryBox} variant="elevated">
                    <Text style={styles.sumTitle}>Expert Recommendation</Text>
                    <Text style={styles.sumDesc}>
                        Correlation detected between bacterial spike in TDS tests and gastro-incidents. Prioritize deep cleaning of filtration membranes in Sector 4.
                    </Text>
                </GlassCard>
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
    chartMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 15, paddingHorizontal: 10 },
    metaText: { ...FONTS.bold, fontSize: 12, color: COLORS.danger, marginLeft: 10 },
    hotspotGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    hotspotCard: { width: '48%', alignItems: 'center', paddingVertical: 20 },
    hVal: { ...FONTS.bold, fontSize: 16, color: COLORS.white },
    hLabel: { ...FONTS.bold, fontSize: 9, color: COLORS.textMuted, marginTop: 4, letterSpacing: 1 },
    hRadar: { marginTop: 15, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    radarCircle: { position: 'absolute', width: 40, height: 40, borderRadius: 20 },
    summaryBox: { padding: 20 },
    sumTitle: { ...FONTS.bold, fontSize: 16, color: COLORS.accent, marginBottom: 8 },
    sumDesc: { ...FONTS.medium, fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
});