import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, SPACE } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import AnimatedButton from '../../components/AnimatedButton';

export default function ContactScreen() {
    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <Text style={styles.title}>Support Core</Text>
                    <Text style={styles.subtitle}>Direct Communication Line to AG-Engineering</Text>
                </MotiView>

                <GlassCard style={styles.formCard} variant="heavy">
                    <Text style={styles.formTitle}>Submit a Technical Request</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Subject</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput style={styles.input} placeholder="e.g. Bot Maintenance Required" placeholderTextColor={COLORS.textMuted} />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Message Body</Text>
                        <View style={[styles.inputWrapper, { height: 120, alignItems: 'flex-start', paddingTop: 12 }]}>
                            <TextInput style={styles.input} multiline placeholder="Describe the issue or feedback..." placeholderTextColor={COLORS.textMuted} />
                        </View>
                    </View>

                    <AnimatedButton title="Transmit Message" variant="primary" iconRight="send-outline" style={styles.submitBtn} />
                </GlassCard>

                <View style={styles.contactMethods}>
                    <GlassCard style={styles.methodCard}>
                        <MaterialCommunityIcons name="email-outline" size={32} color={COLORS.accent} />
                        <Text style={styles.methodVal}>eng@aquaguard.ai</Text>
                        <Text style={styles.methodLabel}>Email Support</Text>
                    </GlassCard>
                    <GlassCard style={styles.methodCard}>
                        <MaterialCommunityIcons name="phone-outline" size={32} color={COLORS.primary} />
                        <Text style={styles.methodVal}>+91 98765 43210</Text>
                        <Text style={styles.methodLabel}>Hotline</Text>
                    </GlassCard>
                </View>

                <View style={styles.officeCard}>
                    <Text style={styles.officeTitle}>Headquarters</Text>
                    <Text style={styles.officeDesc}>AquaGuard Innovation Lab, Digital Valley, TN, India</Text>
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
    formCard: { padding: 20, marginBottom: 30 },
    formTitle: { ...FONTS.bold, fontSize: 18, color: COLORS.white, marginBottom: 20, textAlign: 'center' },
    inputGroup: { marginBottom: 20 },
    label: { ...FONTS.bold, fontSize: 12, color: COLORS.textMuted, marginBottom: 8, textTransform: 'uppercase' },
    inputWrapper: { height: 50, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 16, justifyContent: 'center' },
    input: { flex: 1, color: COLORS.white, ...FONTS.medium, fontSize: 14 },
    submitBtn: { marginTop: 10 },
    contactMethods: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    methodCard: { width: '48%', alignItems: 'center', paddingVertical: 20 },
    methodVal: { ...FONTS.bold, fontSize: 13, color: COLORS.white, marginTop: 12 },
    methodLabel: { ...FONTS.medium, fontSize: 10, color: COLORS.textMuted, marginTop: 4, textTransform: 'uppercase' },
    officeCard: { alignItems: 'center', opacity: 0.5, marginTop: 20 },
    officeTitle: { ...FONTS.bold, fontSize: 14, color: COLORS.white },
    officeDesc: { ...FONTS.medium, fontSize: 12, color: COLORS.textMuted, marginTop: 4, textAlign: 'center' },
});
