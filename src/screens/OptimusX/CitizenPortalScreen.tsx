import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, SPACE } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import SectionHeader from '../../components/SectionHeader';
import IconBadge from '../../components/IconBadge';
import { useLanguage } from '../../context/LanguageContext';

interface FeedItem {
    id: number;
    user: string;
    type: 'Report' | 'Alert' | string;
    message: string;
    time: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap | string;
}

export default function CitizenPortalScreen() {
    const { t } = useLanguage();
    const COMMUNITY_FEED: FeedItem[] = [
        { id: 1, user: 'Rahul S.', type: 'Report', message: 'Clear water observed in Sector 4 inlet!', time: '2h ago', icon: 'check-circle' },
        { id: 2, user: 'Meera K.', type: 'Alert', message: 'Plastic buildup increasing near the bridge.', time: '5h ago', icon: 'alert-decagram' },
    ];

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }}>
                    <Text style={styles.title}>{t('communityDashboard')}</Text>
                    <Text style={styles.subtitle}>{t('citizenPortal')}</Text>
                </MotiView>

                <TouchableOpacity activeOpacity={0.9} style={styles.heroBtn}>
                    <GlassCard style={styles.heroCard} variant="heavy">
                        <LinearGradient colors={[COLORS.primary + '40', 'transparent']} style={StyleSheet.absoluteFill} />
                        <IconBadge icon="bullhorn-outline" size={60} color={COLORS.accent} glow />
                        <Text style={styles.heroTitle}>{t('reportIssue')}</Text>
                        <Text style={styles.heroSub}>{t('describeIssuePlaceholder')}</Text>
                    </GlassCard>
                </TouchableOpacity>

                <SectionHeader title={t('citizenReports')} />
                {COMMUNITY_FEED.map((item, i) => (
                    <MotiView
                        key={item.id}
                        from={{ opacity: 0, translateX: -20 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        transition={{ delay: i * 150 } as any}
                    >
                        <GlassCard style={styles.feedCard}>
                            <View style={styles.feedRow}>
                                <View style={[styles.typeIcon, { backgroundColor: item.type === 'Alert' ? COLORS.danger + '15' : COLORS.success + '15' }]}>
                                    <MaterialCommunityIcons name={item.icon as any} size={20} color={item.type === 'Alert' ? COLORS.danger : COLORS.success} />
                                </View>
                                <View style={styles.feedContent}>
                                    <View style={styles.feedHeader}>
                                        <Text style={styles.feedUser}>{item.user}</Text>
                                        <Text style={styles.feedTime}>{item.time}</Text>
                                    </View>
                                    <Text style={styles.feedMsg}>{item.message}</Text>
                                </View>
                            </View>
                        </GlassCard>
                    </MotiView>
                ))}

                <SectionHeader title={t('safetyTips')} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.resourceScroll}>
                    <TouchableOpacity style={styles.resourceItem}>
                        <GlassCard style={styles.resourceCard}>
                            <MaterialCommunityIcons name="book-open-variant" size={32} color={COLORS.accent} />
                            <Text style={styles.resourceTitle}>Safe Water 101</Text>
                        </GlassCard>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.resourceItem}>
                        <GlassCard style={styles.resourceCard}>
                            <MaterialCommunityIcons name="water-check" size={32} color={COLORS.primary} />
                            <Text style={styles.resourceTitle}>Home Testing</Text>
                        </GlassCard>
                    </TouchableOpacity>
                </ScrollView>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACE[6], paddingTop: 80, paddingBottom: 60 },
    title: { ...FONTS.extraBold, fontSize: 32, color: COLORS.text },
    subtitle: { ...FONTS.medium, fontSize: 16, color: COLORS.textSecondary, marginBottom: SPACE[6] },
    heroBtn: { marginBottom: 30 },
    heroCard: { padding: 24, alignItems: 'center' },
    heroTitle: { ...FONTS.bold, fontSize: 20, color: COLORS.text, marginTop: 16 },
    heroSub: { ...FONTS.medium, fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 22 },
    feedCard: { marginBottom: 12, padding: 12 },
    feedRow: { flexDirection: 'row', alignItems: 'flex-start' },
    typeIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    feedContent: { flex: 1, marginLeft: 16 },
    feedHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    feedUser: { ...FONTS.bold, fontSize: 14, color: COLORS.text },
    feedTime: { ...FONTS.medium, fontSize: 11, color: COLORS.textMuted },
    feedMsg: { ...FONTS.medium, fontSize: 13, color: COLORS.textSecondary, marginTop: 4, lineHeight: 18 },
    resourceScroll: { paddingRight: 40 },
    resourceItem: { width: 140, marginRight: 12 },
    resourceCard: { padding: 20, alignItems: 'center' },
    resourceTitle: { ...FONTS.bold, fontSize: 13, color: COLORS.text, marginTop: 12 },
});