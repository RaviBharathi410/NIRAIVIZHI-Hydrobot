import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, SPACE, SHADOWS } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import SectionHeader from '../../components/SectionHeader';
import AnimatedButton from '../../components/AnimatedButton';

import { useLanguage } from '../../context/LanguageContext';

export default function WaterTestForm() {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        village: 'North Sector',
        source: 'Borewell',
        tds: '',
        ph: '',
        turbidity: '',
        observedSymptoms: '',
    });

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <Text style={styles.title}>{t('waterTest')}</Text>
                    <Text style={styles.subtitle}>{t('recordFieldReadings')}</Text>
                </MotiView>

                <GlassCard style={styles.formCard} variant="heavy">
                    <SectionHeader title={t('location')} />
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('location')}</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                value={formData.village}
                                onChangeText={(text) => setFormData({ ...formData, village: text })}
                                placeholder={t('placeholderLocation')}
                                placeholderTextColor={COLORS.textMuted}
                            />
                        </View>
                    </View>

                    <SectionHeader title={t('testParameters')} />
                    <div style={styles.paramGrid as any}>
                        <View style={[styles.inputGroup, { width: '48%' }]}>
                            <Text style={styles.label}>{t('tds')}</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    placeholder={t('placeholderTds')}
                                    onChangeText={(text) => setFormData({ ...formData, tds: text })}
                                    placeholderTextColor={COLORS.textMuted}
                                />
                            </View>
                        </View>
                        <View style={[styles.inputGroup, { width: '48%' }]}>
                            <Text style={styles.label}>{t('ph')}</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    placeholder={t('placeholderPh')}
                                    onChangeText={(text) => setFormData({ ...formData, ph: text })}
                                    placeholderTextColor={COLORS.textMuted}
                                />
                            </View>
                        </View>
                    </div>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('notesLabel')}</Text>
                        <View style={[styles.inputWrapper, { height: 100, alignItems: 'flex-start', paddingTop: 12 }]}>
                            <TextInput
                                style={styles.input}
                                multiline
                                placeholder={t('placeholderNotes')}
                                placeholderTextColor={COLORS.textMuted}
                            />
                        </View>
                    </View>

                    <AnimatedButton
                        title={t('submitTest')}
                        variant="primary"
                        iconRight="cloud-upload-outline"
                        style={styles.submitBtn}
                    />
                </GlassCard>

                <View style={styles.guideCard}>
                    <MaterialCommunityIcons name="information-outline" size={24} color={COLORS.accent} />
                    <Text style={styles.guideText}>
                        Ensure sensors are calibrated before entry. Readings will be synced to the Regional Health Dashboard immediately.
                    </Text>
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
    formCard: { padding: 20, marginBottom: 24 },
    inputGroup: { marginBottom: 20 },
    label: { ...FONTS.bold, fontSize: 12, color: COLORS.textMuted, marginBottom: 8, textTransform: 'uppercase' },
    inputWrapper: {
        height: 50,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 16,
        justifyContent: 'center',
        ...(SHADOWS.small as any),
    },
    input: { flex: 1, color: COLORS.white, ...FONTS.medium, fontSize: 14 },
    paramGrid: { flexDirection: 'row', justifyContent: 'space-between' },
    submitBtn: { marginTop: 10 },
    guideCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderLeftWidth: 3, borderLeftColor: COLORS.accent, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 8 },
    guideText: { ...FONTS.medium, fontSize: 13, color: COLORS.textSecondary, marginLeft: 12, flex: 1, lineHeight: 18 },
});