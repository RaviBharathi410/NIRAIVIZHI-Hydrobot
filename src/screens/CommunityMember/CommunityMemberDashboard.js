import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, GRADIENTS, SPACE } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import SectionHeader from '../../components/SectionHeader';
import IconBadge from '../../components/IconBadge';
import AnimatedButton from '../../components/AnimatedButton';

export default function CommunityMemberDashboard({ navigation }) {
    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={styles.header}>
                    <Text style={styles.greeting}>Namaste,</Text>
                    <Text style={styles.userName}>Citizen</Text>
                </MotiView>

                <GlassCard style={styles.heroCard} variant="heavy">
                    <View style={styles.heroRow}>
                        <IconBadge icon="water-check" size={70} color={COLORS.success} glow />
                        <View style={styles.heroInfo}>
                            <Text style={styles.heroStatus}>YOUR WATER IS SAFE</Text>
                            <Text style={styles.heroSub}>Last tested: 2 hours ago by HydroBot 07</Text>
                        </View>
                    </View>
                    <View style={styles.heroMetrics}>
                        <View style={styles.hMetric}>
                            <Text style={styles.hVal}>240</Text>
                            <Text style={styles.hLabel}>TDS</Text>
                        </View>
                        <View style={styles.hDivider} />
                        <View style={styles.hMetric}>
                            <Text style={styles.hVal}>7.2</Text>
                            <Text style={styles.hLabel}>pH</Text>
                        </View>
                    </View>
                </GlassCard>

                <SectionHeader title="Community News" />
                <GlassCard style={styles.newsCard}>
                    <Text style={styles.newsTitle}>Volunteer Drive this Sunday</Text>
                    <Text style={styles.newsDesc}>Join us at Sector 4 for a manual plastic sorting workshop. Refreshments provided.</Text>
                    <AnimatedButton title="I am interested" variant="outlined" style={styles.newsBtn} />
                </GlassCard>

                <SectionHeader title="My Environment" />
                <View style={styles.envGrid}>
                    <GlassCard style={styles.envCard}>
                        <MaterialCommunityIcons name="tree-outline" size={32} color={COLORS.success} />
                        <Text style={styles.envVal}>14</Text>
                        <Text style={styles.envLabel}>Trees Saved</Text>
                    </GlassCard>
                    <GlassCard style={styles.envCard}>
                        <MaterialCommunityIcons name="water-percent" size={32} color={COLORS.primary} />
                        <Text style={styles.envVal}>98%</Text>
                        <Text style={styles.envLabel}>Clarity</Text>
                    </GlassCard>
                </View>

                <TouchableOpacity
                    style={styles.exitBtn}
                    onPress={() => navigation.navigate('Logout')}
                >
                    <MaterialCommunityIcons name="power" size={20} color={COLORS.textMuted} />
                    <Text style={styles.exitText}>SIGN OUT</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    content: { padding: SPACE[6], paddingTop: 80, paddingBottom: 60 },
    header: { marginBottom: 30 },
    greeting: { ...FONTS.medium, fontSize: 18, color: COLORS.textSecondary },
    userName: { ...FONTS.extraBold, fontSize: 32, color: COLORS.text },
    heroCard: { padding: 24, marginBottom: 24, overflow: 'hidden' },
    heroRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
    heroInfo: { flex: 1, marginLeft: 20 },
    heroStatus: { ...FONTS.extraBold, fontSize: 20, color: COLORS.success },
    heroSub: { ...FONTS.medium, fontSize: 13, color: COLORS.textSecondary, marginTop: 4, lineHeight: 18 },
    heroMetrics: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 20 },
    hMetric: { flex: 1, alignItems: 'center' },
    hVal: { ...FONTS.bold, fontSize: 22, color: COLORS.text },
    hLabel: { ...FONTS.bold, fontSize: 10, color: COLORS.textMuted, marginTop: 4, letterSpacing: 1 },
    hDivider: { width: 1, height: '80%', backgroundColor: COLORS.border },
    newsCard: { padding: 20, marginBottom: 20, backgroundColor: COLORS.surface },
    newsTitle: { ...FONTS.bold, fontSize: 18, color: COLORS.text },
    newsDesc: { ...FONTS.medium, fontSize: 14, color: COLORS.textSecondary, marginTop: 8, lineHeight: 22 },
    newsBtn: { marginTop: 16 },
    envGrid: { flexDirection: 'row', justifyContent: 'space-between' },
    envCard: { width: '48%', alignItems: 'center', paddingVertical: 20 },
    envVal: { ...FONTS.bold, fontSize: 20, color: COLORS.text, marginTop: 10 },
    envLabel: { ...FONTS.medium, fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
    exitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 40, opacity: 0.5 },
    exitText: { ...FONTS.bold, fontSize: 12, color: COLORS.textMuted, marginLeft: 10, letterSpacing: 2 },
});