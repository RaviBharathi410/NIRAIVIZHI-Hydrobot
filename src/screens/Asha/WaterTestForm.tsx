import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, ZoomIn, FadeInUp } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, SPACE, SHADOWS } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import SectionHeader from '../../components/SectionHeader';
import AnimatedButton from '../../components/AnimatedButton';
import ScreenHeader from '../../components/ScreenHeader';
import Input from '../../components/atoms/Input';

import { useLanguage } from '../../context/LanguageContext';

export default function WaterTestForm({ navigation }: any) {
    const { t } = useLanguage();
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        village: 'North Sector',
        source: 'Borewell',
        tds: '',
        ph: '',
        turbidity: '',
        notes: '',
    });

    const handleSubmit = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1500);
    };

    if (submitted) {
        return (
            <View style={styles.container}>
                <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />
                <View style={styles.successContainer}>
                    <Animated.View entering={ZoomIn.duration(500)}>
                        <View style={styles.successIconOuter}>
                            <LinearGradient colors={GRADIENTS.success as any} style={styles.successIconInner}>
                                <MaterialCommunityIcons name="check-bold" size={60} color="white" />
                            </LinearGradient>
                        </View>
                    </Animated.View>
                    <Animated.Text entering={FadeInUp.delay(300)} style={styles.successTitle}>
                        Test Submitted!
                    </Animated.Text>
                    <Animated.Text entering={FadeInUp.delay(500)} style={styles.successSub}>
                        Data synced to Regional Health Dashboard
                    </Animated.Text>
                    <Animated.View entering={FadeInUp.delay(700)} style={{ width: '100%', marginTop: 40 }}>
                        <AnimatedButton
                            title="Back to Dashboard"
                            variant="primary"
                            onPress={() => navigation.goBack()}
                        />
                    </Animated.View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <ScreenHeader
                        title={t('waterTest') || 'Water Test'}
                        subtitle={t('recordFieldReadings') || 'Field Diagnostic Entry'}
                    />
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <GlassCard style={styles.formCard} variant="heavy">
                        <SectionHeader title={t('location') || 'Source Location'} />
                        <Input
                            label={t('location') || 'Village / Sector'}
                            value={formData.village}
                            onChangeText={(text) => setFormData({ ...formData, village: text })}
                            placeholder={t('placeholderLocation') || 'e.g. North Sector'}
                        />

                        <SectionHeader title={t('testParameters') || 'Sensor Readings'} />
                        <View style={styles.paramGrid}>
                            <View style={{ width: '48%' }}>
                                <Input
                                    type="numeric"
                                    label={t('tds') || 'TDS (ppm)'}
                                    placeholder="0"
                                    value={formData.tds}
                                    onChangeText={(text) => setFormData({ ...formData, tds: text })}
                                />
                            </View>
                            <View style={{ width: '48%' }}>
                                <Input
                                    type="numeric"
                                    label={t('ph') || 'pH Level'}
                                    placeholder="7.0"
                                    value={formData.ph}
                                    onChangeText={(text) => setFormData({ ...formData, ph: text })}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('notesLabel') || 'Additional Observations'}</Text>
                            <View style={styles.textAreaWrapper}>
                                <TextInput
                                    style={styles.textArea}
                                    multiline
                                    placeholder={t('placeholderNotes') || 'Any visible contamination or local reports...'}
                                    placeholderTextColor={COLORS.textMuted}
                                    value={formData.notes}
                                    onChangeText={(text) => setFormData({ ...formData, notes: text })}
                                />
                            </View>
                        </View>

                        <AnimatedButton
                            title={t('submitTest') || 'Upload to Cloud'}
                            variant="primary"
                            iconRight="cloud-upload-outline"
                            loading={loading}
                            onPress={handleSubmit}
                            style={styles.submitBtn}
                        />
                    </GlassCard>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(400).springify()}>
                    <View style={styles.guideCard}>
                        <View style={styles.guideIcon}>
                            <MaterialCommunityIcons name="information-variant" size={24} color={COLORS.accent} />
                        </View>
                        <View style={styles.guideTextContainer}>
                            <Text style={styles.guideTitle}>Field Guidelines</Text>
                            <Text style={styles.guideText}>
                                Ensure sensors are calibrated before entry. Readings will be synced to the Regional Health Dashboard immediately.
                            </Text>
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACE[6], paddingTop: 60, paddingBottom: 60 },
    formCard: { padding: 24, marginBottom: 24, borderRadius: 24 },
    inputGroup: { marginBottom: 20 },
    label: { ...FONTS.bold, fontSize: 13, color: COLORS.textMuted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
    textAreaWrapper: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        paddingHorizontal: 12,
        height: 120,
    },
    textArea: {
        flex: 1,
        color: COLORS.text,
        ...FONTS.medium,
        fontSize: 16,
        textAlignVertical: 'top',
        paddingTop: 12
    },
    paramGrid: { flexDirection: 'row', justifyContent: 'space-between' },
    submitBtn: { marginTop: 10 },
    guideCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: COLORS.surfaceLight,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    guideIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: COLORS.accent + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    guideTextContainer: { flex: 1 },
    guideTitle: { ...FONTS.bold, fontSize: 15, color: COLORS.accent, marginBottom: 4 },
    guideText: { ...FONTS.medium, fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
    successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACE[8] },
    successIconOuter: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.success + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        ...(SHADOWS.glow(COLORS.success, 20, 0.4) as any)
    },
    successIconInner: {
        width: 90,
        height: 90,
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center'
    },
    successTitle: { ...FONTS.extraBold, fontSize: 32, color: COLORS.text, marginBottom: 12, textAlign: 'center' },
    successSub: { ...FONTS.medium, fontSize: 16, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 24 },
});