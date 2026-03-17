import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, SPACE } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import SectionHeader from '../../components/SectionHeader';
import IconBadge from '../../components/IconBadge';

interface Method {
    title: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap | string;
    color: string;
    desc: string;
}

export default function EcoDisposalMethodsScreen() {
    const METHODS: Method[] = [
        { title: 'Aerobic Composting', icon: 'compost', color: '#10B981', desc: 'Turn organic waste into nutrient-rich soil enhancer.' },
        { title: 'Bio-Gas Extraction', icon: 'gas-burner', color: '#F59E0B', desc: 'Convert hyacinth biomass into clean cooking energy.' },
        { title: 'Recycling Core', icon: 'recycle', color: '#3B82F6', desc: 'Sort plastics and metals for industrial repurposing.' },
        { title: 'Safe Landfill', icon: 'landslide-outline', color: '#EF4444', desc: 'Responsible disposal of non-recyclable inert waste.' },
    ];

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <Text style={styles.title}>Eco Strategy</Text>
                    <Text style={styles.subtitle}>Responsible Waste Management Protocols</Text>
                </MotiView>

                <View style={styles.grid}>
                    {METHODS.map((method, i) => (
                        <MotiView
                            key={method.title}
                            from={{ opacity: 0, translateY: 20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ delay: i * 150 } as any}
                            style={styles.cardWrapper}
                        >
                            <GlassCard style={styles.methodCard}>
                                <IconBadge icon={method.icon as any} size={50} color={method.color} glow />
                                <Text style={styles.methodTitle}>{method.title}</Text>
                                <Text style={styles.methodDesc}>{method.desc}</Text>
                                <View style={[styles.statusBadge, { backgroundColor: method.color + '20' }]}>
                                    <Text style={[styles.statusText, { color: method.color }]}>ACTIVE PATHWAY</Text>
                                </View>
                            </GlassCard>
                        </MotiView>
                    ))}
                </View>

                <SectionHeader title="Impact Overview" />
                <GlassCard style={styles.impactCard} variant="elevated">
                    <View style={styles.impactRow}>
                        <View style={styles.impactItem}>
                            <Text style={styles.impactVal}>84%</Text>
                            <Text style={styles.impactLabel}>Diversion Rate</Text>
                        </View>
                        <View style={styles.impactItem}>
                            <Text style={styles.impactVal}>12t</Text>
                            <Text style={styles.impactLabel}>Monthly Offset</Text>
                        </View>
                    </View>
                </GlassCard>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACE[6], paddingTop: 80, paddingBottom: 60 },
    title: { ...FONTS.extraBold, fontSize: 32, color: COLORS.text, marginBottom: 8 },
    subtitle: { ...FONTS.medium, fontSize: 16, color: COLORS.textSecondary, marginBottom: SPACE[6] },
    grid: { marginTop: 10 },
    cardWrapper: { marginBottom: 16 },
    methodCard: { padding: 24, alignItems: 'center' },
    methodTitle: { ...FONTS.bold, fontSize: 20, color: COLORS.text, marginTop: 16, textAlign: 'center' },
    methodDesc: { ...FONTS.medium, fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 22 },
    statusBadge: { marginTop: 20, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
    statusText: { ...FONTS.bold, fontSize: 10, letterSpacing: 1 },
    impactCard: { paddingVertical: 24 },
    impactRow: { flexDirection: 'row', justifyContent: 'space-around' },
    impactItem: { alignItems: 'center' },
    impactVal: { ...FONTS.bold, fontSize: 28, color: COLORS.primary },
    impactLabel: { ...FONTS.bold, fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
});