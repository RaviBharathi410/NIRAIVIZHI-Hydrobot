import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, SPACE, SHADOWS } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import SectionHeader from '../../components/SectionHeader';
import IconBadge from '../../components/IconBadge';
import AnimatedButton from '../../components/AnimatedButton';
import SimpleChart from '../../components/charts/SimpleChart';

export default function HealthOfficialDashboard() {
    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }} style={styles.header}>
                    <Text style={styles.title}>Regional Portal</Text>
                    <Text style={styles.subtitle}>Health & Sanitation Oversight Dashboard</Text>
                </MotiView>

                <View style={styles.alertBanner}>
                    <GlassCard style={styles.alertCard} variant="elevated">
                        <MaterialCommunityIcons name="alert-decagram" size={24} color={COLORS.danger} />
                        <Text style={styles.alertText}>URGENT: Bacterial spike detected in Sector 4. Manual audit requested.</Text>
                    </GlassCard>
                </View>

                <SectionHeader title="Caseload Overview" />
                <GlassCard style={styles.chartCard}>
                    <SimpleChart
                        data={[40, 35, 60, 85, 95, 110, 105]}
                        labels={['M', 'T', 'W', 'T', 'F', 'S', 'S']}
                        color={COLORS.danger}
                        height={180}
                        title="Water-borne Symptom Tracking"
                    />
                </GlassCard>

                <SectionHeader title="Resource Allocation" />
                <View style={styles.grid}>
                    <GlassCard style={styles.gridCard}>
                        <IconBadge icon="ambulance" size={40} color={COLORS.accent} />
                        <Text style={styles.gridVal}>12</Text>
                        <Text style={styles.gridLabel}>Available Units</Text>
                    </GlassCard>
                    <GlassCard style={styles.gridCard}>
                        <IconBadge icon="water-pump" size={40} color={COLORS.primary} />
                        <Text style={styles.gridVal}>84%</Text>
                        <Text style={styles.gridLabel}>Filtration Efficiency</Text>
                    </GlassCard>
                </View>

                <SectionHeader title="Official Directives" />
                <GlassCard style={styles.directiveCard}>
                    <Text style={styles.dirTitle}>Enforce Level 2 Water Protocol</Text>
                    <Text style={styles.dirDesc}>Directing all community members to boil water before consumption in high-risk zones.</Text>
                    <AnimatedButton title="Broadcast Directive" variant="primary" style={styles.dirBtn} />
                </GlassCard>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACE[6], paddingTop: 80, paddingBottom: 60 },
    header: { marginBottom: 30 },
    title: { ...FONTS.extraBold, fontSize: 32, color: COLORS.white },
    subtitle: { ...FONTS.medium, fontSize: 16, color: COLORS.textSecondary },
    alertBanner: { marginBottom: 24 },
    alertCard: { padding: 16, backgroundColor: 'rgba(239, 68, 68, 0.1)', flexDirection: 'row', alignItems: 'center', borderColor: COLORS.danger, borderWidth: 1 },
    alertText: { flex: 1, marginLeft: 12, ...FONTS.bold, fontSize: 13, color: COLORS.danger, lineHeight: 18 },
    chartCard: { padding: 16, marginBottom: 24 },
    grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    gridCard: { width: '48%', alignItems: 'center', paddingVertical: 20 },
    gridVal: { ...FONTS.bold, fontSize: 24, color: COLORS.white, marginTop: 12 },
    gridLabel: { ...FONTS.medium, fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
    directiveCard: { padding: 20 },
    dirTitle: { ...FONTS.bold, fontSize: 18, color: COLORS.white },
    dirDesc: { ...FONTS.medium, fontSize: 14, color: COLORS.textSecondary, marginTop: 8, lineHeight: 22 },
    dirBtn: { marginTop: 16 },
});