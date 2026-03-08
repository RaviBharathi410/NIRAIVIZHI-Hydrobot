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

interface TrashItem {
    label: string;
    value: number;
    icon: keyof typeof MaterialCommunityIcons.glyphMap | string;
    color: string;
}

export default function LiveTrashAnalyticsScreen() {
    const TRASH_DATA: TrashItem[] = [
        { label: 'Plastic', value: 45, icon: 'bottle-wine-outline', color: '#3B82F6' },
        { label: 'Organic', value: 25, icon: 'leaf', color: '#10B981' },
        { label: 'Metallic', value: 15, icon: 'trash-can-outline', color: '#94A3B8' },
        { label: 'Others', value: 15, icon: 'dots-horizontal-circle-outline', color: '#F59E0B' },
    ];

    const DAILY_COLLECTION = [20, 35, 42, 38, 55, 68, 62];

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }}>
                    <Text style={styles.title}>Waste Intelligence</Text>
                    <Text style={styles.subtitle}>Composition & Collection Analytics</Text>
                </MotiView>

                <SectionHeader title="Current Composition" />
                <View style={styles.compositionGrid}>
                    {TRASH_DATA.map((item, i) => (
                        <MotiView
                            key={item.label}
                            from={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 100 } as any}
                            style={styles.trashCardContainer}
                        >
                            <GlassCard style={styles.trashCard}>
                                <IconBadge icon={item.icon as any} size={40} color={item.color} />
                                <Text style={styles.trashValue}>{item.value}%</Text>
                                <Text style={styles.trashLabel}>{item.label}</Text>
                                <View style={styles.progressTrack}>
                                    <View style={[styles.progressFill, { width: `${item.value}%`, backgroundColor: item.color }]} />
                                </View>
                            </GlassCard>
                        </MotiView>
                    ))}
                </View>

                <SectionHeader title="Weekly Volume (kg)" />
                <GlassCard>
                    <SimpleChart
                        data={DAILY_COLLECTION}
                        labels={['M', 'T', 'W', 'T', 'F', 'S', 'S']}
                        color={COLORS.accent}
                        height={160}
                    />
                </GlassCard>

                <SectionHeader title="Impact Metrics" />
                <GlassCard style={styles.impactCard}>
                    <View style={styles.impactRow}>
                        <View style={styles.impactItem}>
                            <Text style={styles.impactVal}>1.2t</Text>
                            <Text style={styles.impactLabel}>Removed</Text>
                        </View>
                        <View style={styles.impactDivider} />
                        <View style={styles.impactItem}>
                            <Text style={styles.impactVal}>84%</Text>
                            <Text style={styles.impactLabel}>Recyclable</Text>
                        </View>
                        <View style={styles.impactDivider} />
                        <View style={styles.impactItem}>
                            <Text style={styles.impactVal}>4.2k</Text>
                            <Text style={styles.impactLabel}>Area Score</Text>
                        </View>
                    </View>
                </GlassCard>

                <GlassCard style={styles.suggestionBox} variant="elevated">
                    <LinearGradient colors={[COLORS.accent + '20', 'transparent']} style={StyleSheet.absoluteFill} />
                    <MaterialCommunityIcons name="lightbulb-on-outline" size={24} color={COLORS.accent} />
                    <View style={styles.suggestionText}>
                        <Text style={styles.sugTitle}>Eco Insight</Text>
                        <Text style={styles.sugDesc}>High plastic concentration detected near Sector 4. Recommend prioritizing Bot 07 and 09 for localized extraction.</Text>
                    </View>
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
    compositionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    trashCardContainer: { width: '48%', marginBottom: 16 },
    trashCard: { alignItems: 'center', paddingVertical: 20 },
    trashValue: { ...FONTS.extraBold, fontSize: 22, color: COLORS.white, marginTop: 12 },
    trashLabel: { ...FONTS.bold, fontSize: 12, color: COLORS.textMuted, marginBottom: 12 },
    progressTrack: { width: '80%', height: 4, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 2 },
    impactCard: { paddingVertical: 20 },
    impactRow: { flexDirection: 'row', justifyContent: 'space-around' },
    impactItem: { alignItems: 'center' },
    impactVal: { ...FONTS.bold, fontSize: 20, color: COLORS.white },
    impactLabel: { ...FONTS.medium, fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
    impactDivider: { width: 1, height: '100%', backgroundColor: 'rgba(255,255,255,0.08)' },
    suggestionBox: { flexDirection: 'row', alignItems: 'flex-start', padding: 16, marginTop: 10 },
    suggestionText: { flex: 1, marginLeft: 16 },
    sugTitle: { ...FONTS.bold, fontSize: 16, color: COLORS.accent },
    sugDesc: { ...FONTS.medium, fontSize: 13, color: COLORS.textSecondary, marginTop: 4, lineHeight: 20 },
});