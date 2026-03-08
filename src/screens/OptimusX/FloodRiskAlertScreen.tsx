import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, SPACE } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import SectionHeader from '../../components/SectionHeader';
import RingGauge from '../../components/RingGauge';

export default function FloodRiskAlertScreen() {
    const [riskLevel] = useState(25); // 0-100

    const getRiskStatus = () => {
        if (riskLevel < 35) return { label: 'LOW', color: COLORS.success, icon: 'check-circle' as const };
        if (riskLevel < 70) return { label: 'MODERATE', color: COLORS.warning, icon: 'alert-circle' as const };
        return { label: 'CRITICAL', color: COLORS.danger, icon: 'alert-octagon' as const };
    };

    const status = getRiskStatus();

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }}>
                    <Text style={styles.title}>Flood Sentinel</Text>
                    <Text style={styles.subtitle}>Hydrostatic Risk Mapping & Early Warning</Text>
                </MotiView>

                <GlassCard style={styles.riskCard} variant="heavy">
                    <RingGauge
                        value={riskLevel}
                        maxValue={100}
                        size={220}
                        strokeWidth={20}
                        color={status.color}
                        unit="%"
                        label="RISK INDEX"
                    />
                    <MotiView
                        from={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring' } as any}
                        style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}
                    >
                        <MaterialCommunityIcons name={status.icon} size={20} color={status.color} />
                        <Text style={[styles.statusText, { color: status.color }]}>{status.label} RISK</Text>
                    </MotiView>
                </GlassCard>

                <SectionHeader title="Sensor Diagnostics" />
                <View style={styles.grid}>
                    <GlassCard style={styles.gridItem}>
                        <Text style={styles.gVal}>4.2m</Text>
                        <Text style={styles.gLabel}>Water Level</Text>
                    </GlassCard>
                    <GlassCard style={styles.gridItem}>
                        <Text style={styles.gVal}>128m³/s</Text>
                        <Text style={styles.gLabel}>Current Flow</Text>
                    </GlassCard>
                </View>

                <SectionHeader title="Precipitation Forecast" />
                <GlassCard>
                    <View style={styles.forecastRow}>
                        {[...Array(5)].map((_, i) => (
                            <View key={i} style={styles.forecastItem}>
                                <Text style={styles.fDay}>+{i + 1}h</Text>
                                <MaterialCommunityIcons
                                    name={i % 2 === 0 ? "weather-rainy" : "weather-cloudy"}
                                    size={24}
                                    color={COLORS.accent}
                                />
                                <Text style={styles.fVal}>{12 + i * 4}mm</Text>
                            </View>
                        ))}
                    </View>
                </GlassCard>

                <GlassCard style={styles.evacuationCard} variant="elevated">
                    <View style={styles.evacHeader}>
                        <MaterialCommunityIcons name="map-marker-path" size={24} color={COLORS.primary} />
                        <Text style={styles.evacTitle}>SafeZones Detected</Text>
                    </View>
                    <Text style={styles.evacDesc}>
                        Primary route to Sector 4 Highground is CLEAR. Emergency services notified of current water levels.
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
    riskCard: { alignItems: 'center', paddingVertical: 40, marginBottom: 20 },
    statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginTop: 30 },
    statusText: { ...FONTS.extraBold, fontSize: 12, marginLeft: 8, letterSpacing: 1 },
    grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    gridItem: { width: '48%', alignItems: 'center', paddingVertical: 16 },
    gVal: { ...FONTS.bold, fontSize: 18, color: COLORS.white },
    gLabel: { ...FONTS.medium, fontSize: 10, color: COLORS.textMuted, marginTop: 4, textTransform: 'uppercase' },
    forecastRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
    forecastItem: { alignItems: 'center' },
    fDay: { ...FONTS.bold, fontSize: 10, color: COLORS.textMuted, marginBottom: 8 },
    fVal: { ...FONTS.bold, fontSize: 13, color: COLORS.white, marginTop: 8 },
    evacuationCard: { marginTop: 10, padding: 20 },
    evacHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    evacTitle: { ...FONTS.bold, fontSize: 16, color: COLORS.white, marginLeft: 12 },
    evacDesc: { ...FONTS.medium, fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
});