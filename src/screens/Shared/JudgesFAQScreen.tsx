import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, SPACE } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';

export default function JudgesFAQScreen() {
    const FAQS = [
        { q: 'How does the AI detect trash?', a: 'OptimusX uses a custom YOLOV8-lite model trained on local water debris datasets, running directly on the edge.' },
        { q: 'What is the bot battery life?', a: 'Under typical mission loads, each HydroBot can operate for 12 hours before automated docking for recharging.' },
        { q: 'How reliable is the TDS sensor?', a: 'The industrial-grade probe offers ±2% accuracy and is self-calibrating every 24 hours.' },
        { q: 'Scalability for larger lakes?', a: 'The fleet management system supports up to 50 bots with mesh networking for seamless coordination.' },
    ];

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <MotiView from={{ opacity: 0, translateX: -20 }} animate={{ opacity: 1, translateX: 0 }}>
                    <Text style={styles.title}>Technical FAQ</Text>
                    <Text style={styles.subtitle}>Detailed insights for the Evaluation Committee</Text>
                </MotiView>

                <View style={styles.faqList}>
                    {FAQS.map((faq, i) => (
                        <MotiView
                            key={i}
                            from={{ opacity: 0, translateY: 10 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ delay: i * 150 } as any}
                        >
                            <GlassCard style={styles.faqCard}>
                                <View style={styles.qRow}>
                                    <MaterialCommunityIcons name="help-circle-outline" size={20} color={COLORS.accent} />
                                    <Text style={styles.question}>{faq.q}</Text>
                                </View>
                                <View style={styles.aRow}>
                                    <View style={styles.aLine} />
                                    <Text style={styles.answer}>{faq.a}</Text>
                                </View>
                            </GlassCard>
                        </MotiView>
                    ))}
                </View>

                <GlassCard style={styles.badgeCard} variant="elevated">
                    <MaterialCommunityIcons name="seal-variant" size={40} color={COLORS.primary} />
                    <View style={styles.badgeInfo}>
                        <Text style={styles.badgeTitle}>Verified Innovation</Text>
                        <Text style={styles.badgeSub}>AquaGuard OptimusX v4.2 Production Build</Text>
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
    faqList: { marginTop: 20 },
    faqCard: { marginBottom: 16, padding: 20 },
    qRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    question: { ...FONTS.bold, fontSize: 16, color: COLORS.white, marginLeft: 12, flex: 1 },
    aRow: { flexDirection: 'row' },
    aLine: { width: 2, backgroundColor: COLORS.accent + '40', borderRadius: 1, marginRight: 15 },
    answer: { ...FONTS.medium, fontSize: 14, color: COLORS.textSecondary, flex: 1, lineHeight: 22 },
    badgeCard: { flexDirection: 'row', alignItems: 'center', padding: 20, marginTop: 20 },
    badgeInfo: { marginLeft: 20 },
    badgeTitle: { ...FONTS.bold, fontSize: 16, color: COLORS.white },
    badgeSub: { ...FONTS.medium, fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
});
