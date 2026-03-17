import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, GRADIENTS, SPACE, SHADOWS } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import { useAuth } from '../../context/AuthContext';
import ScreenHeader from '../../components/ScreenHeader';

export default function SettingsScreen({ navigation }) {
    const [notifications, setNotifications] = useState(true);
    const [biometrics, setBiometrics] = useState(false);

    const languages = [
        { name: 'English', code: 'en' },
        { name: 'Hindi', code: 'hi' },
        { name: 'Tamil', code: 'ta' },
    ];

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <ScreenHeader
                    title="Settings"
                    subtitle="System Preferences & Profile"
                    showActions={false}
                    showBack={true}
                />

                <Text style={styles.sectionLabel}>Account & Profile</Text>
                <GlassCard style={styles.card} variant="heavy">
                    <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate('Profile')}>
                        <MaterialCommunityIcons name="account-circle-outline" size={24} color={COLORS.primary} style={{ marginRight: 15 }} />
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Edit Profile</Text>
                            <Text style={styles.settingSub}>Update your personal and operator DNA</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.textMuted} />
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.settingRow}>
                        <MaterialCommunityIcons name="shield-check-outline" size={24} color={COLORS.success} style={{ marginRight: 15 }} />
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Security & Privacy</Text>
                            <Text style={styles.settingSub}>Manage credentials and mission access</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.textMuted} />
                    </TouchableOpacity>
                </GlassCard>

                <Text style={styles.sectionLabel}>System Preferences</Text>
                <GlassCard style={styles.card} variant="heavy">
                    <View style={styles.settingRow}>
                        <MaterialCommunityIcons name="bell-outline" size={24} color={COLORS.accent} style={{ marginRight: 15 }} />
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Push Notifications</Text>
                            <Text style={styles.settingSub}>Alerts for sensor thresholds</Text>
                        </View>
                        <Switch
                            value={notifications}
                            onValueChange={setNotifications}
                            trackColor={{ false: COLORS.border as string, true: COLORS.primaryLight as string }}
                            thumbColor={notifications ? COLORS.primary : COLORS.textMuted}
                        />
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.settingRow}>
                        <MaterialCommunityIcons name="fingerprint" size={24} color={COLORS.primary} style={{ marginRight: 15 }} />
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Biometric Lock</Text>
                            <Text style={styles.settingSub}>Fingerprint/FaceID security</Text>
                        </View>
                        <Switch
                            value={biometrics}
                            onValueChange={setBiometrics}
                            trackColor={{ false: COLORS.border as string, true: COLORS.primaryLight as string }}
                            thumbColor={biometrics ? COLORS.primary : COLORS.textMuted}
                        />
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.settingRow}>
                        <MaterialCommunityIcons name="palette-outline" size={24} color="#A78BFA" style={{ marginRight: 15 }} />
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Holographic UI Mode</Text>
                            <Text style={styles.settingSub}>Enable advanced glassmorphism effects</Text>
                        </View>
                        <Switch
                            value={true}
                            onValueChange={() => { }}
                            trackColor={{ false: COLORS.border as string, true: COLORS.primaryLight as string }}
                            thumbColor={COLORS.primary}
                        />
                    </View>
                </GlassCard>

                <Text style={styles.sectionLabel}>Support & Info</Text>
                <GlassCard style={styles.card} variant="heavy">
                    <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate('JudgesFAQ')}>
                        <MaterialCommunityIcons name="frequently-asked-questions" size={24} color={COLORS.warning} style={{ marginRight: 15 }} />
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Technical Documentation</Text>
                            <Text style={styles.settingSub}>View system specifications and FAQs</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.textMuted} />
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate('Contact')}>
                        <MaterialCommunityIcons name="headset" size={24} color={COLORS.primary} style={{ marginRight: 15 }} />
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Support Center</Text>
                            <Text style={styles.settingSub}>Contact mission control</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.textMuted} />
                    </TouchableOpacity>
                </GlassCard>

                <Text style={styles.sectionLabel}>Display Language</Text>
                <GlassCard style={styles.card} variant="heavy">
                    {languages.map((lang, i) => (
                        <React.Fragment key={lang.code}>
                            <TouchableOpacity style={styles.langRow} activeOpacity={0.7}>
                                <Text style={styles.langName}>{lang.name}</Text>
                                {i === 0 && <MaterialCommunityIcons name="check-circle" size={20} color={COLORS.primary} />}
                            </TouchableOpacity>
                            {i < languages.length - 1 && <View style={styles.divider} />}
                        </React.Fragment>
                    ))}
                </GlassCard>

                <TouchableOpacity
                    style={styles.logoutBtn}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('Logout')}
                >
                    <MaterialCommunityIcons name="power" size={24} color={COLORS.danger} style={{ marginRight: 10 }} />
                    <Text style={styles.logoutText}>Terminate Session</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scrollContent: { padding: SPACE[6], paddingTop: 20, paddingBottom: 60 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
    backBtn: { marginRight: 16 },
    title: { ...FONTS.extraBold, fontSize: 28, color: COLORS.text },
    sectionLabel: { ...FONTS.extraBold, fontSize: 13, color: COLORS.textMuted, marginBottom: 12, marginTop: 10, textTransform: 'uppercase', letterSpacing: 1 },
    card: { paddingHorizontal: 20, marginBottom: 24, backgroundColor: COLORS.surface, borderRadius: 24, borderWidth: 1, borderColor: COLORS.border },
    settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18 },
    settingInfo: { flex: 1 },
    settingTitle: { ...FONTS.bold, fontSize: 16, color: COLORS.text },
    settingSub: { ...FONTS.medium, fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
    divider: { height: 1, backgroundColor: COLORS.border as string },
    langRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 18 },
    langName: { ...FONTS.semiBold, fontSize: 16, color: COLORS.text },
    logoutBtn: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 59, 48, 0.2)'
    },
    logoutText: { ...FONTS.bold, color: COLORS.danger, fontSize: 16 }
});
