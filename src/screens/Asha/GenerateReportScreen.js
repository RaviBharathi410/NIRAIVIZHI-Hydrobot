import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, GRADIENTS, SPACE } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import AnimatedButton from '../../components/AnimatedButton';
import IconBadge from '../../components/IconBadge';

export default function GenerateReportScreen() {
    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <Text style={styles.title}>Intelligence Center</Text>
                    <Text style={styles.subtitle}>Automated Report Generation & Archiving</Text>
                </MotiView>

                <GlassCard style={styles.reportPreview} variant="heavy">
                    <View style={styles.docHeader}>
                        <MaterialCommunityIcons name="file-pdf-box" size={40} color={COLORS.danger} />
                        <View style={styles.docInfo}>
                            <Text style={styles.docTitle}>WEEKLY_ANALYSIS_V4.PDF</Text>
                            <Text style={styles.docMeta}>Size: 2.4 MB • Generated: Just Now</Text>
                        </View>
                    </View>
                    <View style={styles.previewMock}>
                        <View style={styles.mockLine} />
                        <View style={[styles.mockLine, { width: '80%' }]} />
                        <View style={[styles.mockLine, { width: '40%' }]} />
                        <View style={styles.mockChartMock}>
                            <View style={styles.mockBar} />
                            <View style={[styles.mockBar, { height: 60 }]} />
                            <View style={[styles.mockBar, { height: 40 }]} />
                        </View>
                    </View>
                    <AnimatedButton title="Download PDF" variant="primary" iconLeft="download-outline" style={styles.actionBtn} />
                </GlassCard>

                <View style={styles.optionList}>
                    <GlassCard style={styles.optionRow}>
                        <IconBadge icon="email-outline" size={32} color={COLORS.accent} />
                        <Text style={styles.optionText}>Email to Health Official</Text>
                        <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.textMuted} />
                    </GlassCard>
                    <GlassCard style={styles.optionRow}>
                        <IconBadge icon="share-variant-outline" size={32} color={COLORS.primary} />
                        <Text style={styles.optionText}>Share via WhatsApp</Text>
                        <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.textMuted} />
                    </GlassCard>
                </View>

                <View style={styles.historyCard}>
                    <Text style={styles.historyTitle}>Recent History</Text>
                    <View style={styles.histItem}>
                        <Text style={styles.histName}>Month_End_Report.pdf</Text>
                        <Text style={styles.histDate}>Feb 15, 2026</Text>
                    </View>
                    <View style={styles.histItem}>
                        <Text style={styles.histName}>Outbreak_Audit_North.pdf</Text>
                        <Text style={styles.histDate}>Feb 10, 2026</Text>
                    </View>
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
    reportPreview: { padding: 20, marginBottom: 24, alignItems: 'center' },
    docHeader: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 20 },
    docInfo: { marginLeft: 16 },
    docTitle: { ...FONTS.bold, fontSize: 16, color: COLORS.white },
    docMeta: { ...FONTS.medium, fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
    previewMock: { width: '100%', height: 160, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 16, marginBottom: 20 },
    mockLine: { height: 4, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 2, marginBottom: 10 },
    mockChartMock: { flexDirection: 'row', alignItems: 'flex-end', height: 80, marginTop: 10, justifyContent: 'space-around' },
    mockBar: { width: 30, height: 50, backgroundColor: COLORS.accent + '40', borderRadius: 4 },
    actionBtn: { width: '100%' },
    optionList: { marginBottom: 24 },
    optionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingHorizontal: 16, paddingVertical: 12 },
    optionText: { flex: 1, marginLeft: 16, ...FONTS.bold, fontSize: 14, color: COLORS.white },
    historyCard: { padding: 20, opacity: 0.7 },
    historyTitle: { ...FONTS.bold, fontSize: 14, color: COLORS.textMuted, marginBottom: 15, textTransform: 'uppercase' },
    histItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.03)', paddingBottom: 12 },
    histName: { ...FONTS.medium, fontSize: 13, color: COLORS.white },
    histDate: { ...FONTS.medium, fontSize: 11, color: COLORS.textMuted },
});