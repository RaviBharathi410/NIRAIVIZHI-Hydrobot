import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, GRADIENTS, SPACE, SHADOWS } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import { useAuth } from '../../context/AuthContext';

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

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Settings</Text>
                </View>

                <Text style={styles.sectionLabel}>System Preferences</Text>
                <GlassCard style={styles.card} variant="heavy">
                    <View style={styles.settingRow}>
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
                    style={styles.dangerBtn}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('Logout')}
                >
                    <Text style={styles.dangerText}>Account & Security Settings</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACE[6], paddingTop: 60, paddingBottom: 40 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
    backBtn: { marginRight: 16 },
    title: { ...FONTS.extraBold, fontSize: 28, color: COLORS.text },
    sectionLabel: { ...FONTS.extraBold, fontSize: 13, color: COLORS.textMuted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
    card: { paddingHorizontal: 20, marginBottom: 24, backgroundColor: COLORS.surface, borderRadius: 24, borderWidth: 1, borderColor: COLORS.border },
    settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18 },
    settingInfo: { flex: 1 },
    settingTitle: { ...FONTS.bold, fontSize: 16, color: COLORS.text },
    settingSub: { ...FONTS.medium, fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
    divider: { height: 1, backgroundColor: COLORS.border as string },
    langRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 18 },
    langName: { ...FONTS.semiBold, fontSize: 16, color: COLORS.text },
    dangerBtn: { marginTop: 10, alignItems: 'center', padding: 16 },
    dangerText: { ...FONTS.bold, color: COLORS.danger, fontSize: 14 }
});
