import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, ZoomIn, FadeInUp } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, SPACE, SHADOWS } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import SectionHeader from '../../components/SectionHeader';
import AnimatedButton from '../../components/AnimatedButton';
import ScreenHeader from '../../components/ScreenHeader';

export default function GenerateReportScreen() {
    const [generating, setGenerating] = useState(false);
    const [ready, setReady] = useState(false);

    const handleGenerate = () => {
        setGenerating(true);
        setTimeout(() => {
            setGenerating(false);
            setReady(true);
        }, 2000);
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <ScreenHeader
                        title="Regional Report"
                        subtitle="Export Analytics & Field Data"
                        showBack={true}
                    />
                </Animated.View>

                {!ready ? (
                    <Animated.View entering={FadeInDown.delay(200).springify()}>
                        <GlassCard style={styles.configCard} variant="heavy">
                            <SectionHeader title="Report Parameters" />
                            <View style={styles.paramRow}>
                                <View style={styles.paramItem}>
                                    <Text style={styles.pLabel}>TIME RANGE</Text>
                                    <Text style={styles.pVal}>Last 7 Days</Text>
                                </View>
                                <View style={styles.paramItem}>
                                    <Text style={styles.pLabel}>SECTOR</Text>
                                    <Text style={styles.pVal}>North Delta</Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.includeSection}>
                                <Text style={styles.incTitle}>INCLUDED ANALYTICS</Text>
                                <View style={styles.tagRow}>
                                    <View style={styles.tag}><Text style={styles.tagText}>Water Quality</Text></View>
                                    <View style={styles.tag}><Text style={styles.tagText}>Symptom Trends</Text></View>
                                    <View style={styles.tag}><Text style={styles.tagText}>AI Risk Map</Text></View>
                                </View>
                            </View>

                            <AnimatedButton
                                title="Compile Health Report"
                                variant="primary"
                                iconRight="file-plus-outline"
                                loading={generating}
                                onPress={handleGenerate}
                                style={{ marginTop: 10 }}
                            />
                        </GlassCard>
                    </Animated.View>
                ) : (
                    <View style={styles.readyContainer}>
                        <Animated.View entering={ZoomIn.duration(600)}>
                            <GlassCard style={styles.previewSheet} variant="heavy">
                                <View style={styles.sheetHeader}>
                                    <MaterialCommunityIcons name="water-check" size={24} color={COLORS.primary} />
                                    <Text style={styles.sheetTitle}>NIRAIVIZHI FIELD REPORT</Text>
                                </View>
                                <View style={styles.sheetLine} />
                                <View style={styles.sheetBody}>
                                    <View style={styles.mockLineShort} />
                                    <View style={styles.mockLineLong} />
                                    <View style={styles.mockLineMed} />
                                    <View style={styles.mockGrid}>
                                        <View style={styles.mockBox} />
                                        <View style={styles.mockBox} />
                                    </View>
                                    <View style={styles.mockLineLong} />
                                </View>
                                <LinearGradient
                                    colors={['transparent', COLORS.surface + '60']}
                                    style={styles.sheetFade}
                                />
                            </GlassCard>
                        </Animated.View>

                        <Animated.View entering={FadeInUp.delay(300)} style={styles.actionRow}>
                            <View style={{ flex: 1 }}>
                                <AnimatedButton
                                    title="Export PDF"
                                    variant="primary"
                                    iconLeft="file-pdf-box"
                                    onPress={() => { }}
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <AnimatedButton
                                    title="Share"
                                    variant="outline"
                                    iconLeft="share-variant-outline"
                                    onPress={() => { }}
                                />
                            </View>
                        </Animated.View>

                        <AnimatedButton
                            title="Regenerate with New Data"
                            variant="ghost"
                            onPress={() => setReady(false)}
                            style={{ alignSelf: 'center', marginTop: 10 }}
                        />
                    </View>
                )}

                <Animated.View entering={FadeInDown.delay(400).springify()}>
                    <View style={styles.footerInfo}>
                        <MaterialCommunityIcons name="lock-outline" size={16} color={COLORS.textMuted} />
                        <Text style={styles.footerText}>
                            Reports are encrypted and require administrative clearance to open after export.
                        </Text>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACE[6], paddingTop: 60, paddingBottom: 60 },
    configCard: { padding: 24, borderRadius: 24 },
    paramRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    paramItem: { flex: 1 },
    pLabel: { ...FONTS.bold, fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, marginBottom: 4 },
    pVal: { ...FONTS.bold, fontSize: 16, color: COLORS.text },
    divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 20 },
    includeSection: { marginBottom: 24 },
    incTitle: { ...FONTS.bold, fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, marginBottom: 12 },
    tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    tag: { backgroundColor: COLORS.surfaceLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
    tagText: { ...FONTS.medium, fontSize: 12, color: COLORS.textSecondary },
    readyContainer: { gap: 24 },
    previewSheet: {
        height: 380,
        padding: 24,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    sheetHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    sheetTitle: { ...FONTS.bold, fontSize: 14, color: COLORS.primary, marginLeft: 12, letterSpacing: 1 },
    sheetLine: { height: 1, backgroundColor: COLORS.primary + '30', marginBottom: 20 },
    sheetBody: { gap: 12 },
    mockLineShort: { width: '40%', height: 8, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 4 },
    mockLineMed: { width: '65%', height: 8, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 4 },
    mockLineLong: { width: '100%', height: 8, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 4 },
    mockGrid: { flexDirection: 'row', gap: 12, marginVertical: 8 },
    mockBox: { flex: 1, height: 60, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 8, borderStyle: 'dashed', borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)' },
    sheetFade: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 100 },
    actionRow: { flexDirection: 'row', gap: 12 },
    footerInfo: { flexDirection: 'row', alignItems: 'center', padding: 20, marginTop: 20, opacity: 0.6 },
    footerText: { ...FONTS.medium, fontSize: 11, color: COLORS.textMuted, marginLeft: 12, flex: 1, lineHeight: 16 },
});