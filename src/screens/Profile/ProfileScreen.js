import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, GRADIENTS, SPACE, SHADOWS, SPRING } from '../../constants/theme';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function ProfileScreen({ navigation }) {
    const { user, logout } = useContext(AuthContext);
    const { t } = useLanguage();

    const ACTIONS = [
        {
            title: 'Patient Entry',
            subtitle: 'Register & sync patient records',
            icon: 'account-plus',
            color: COLORS.primary,
            screen: 'PatientEntry'
        },
        {
            title: 'AI Symptoms Analysis',
            subtitle: 'ML-driven health screening',
            icon: 'brain',
            color: "#6366F1",
            screen: 'MLSymptoms'
        },
        {
            title: 'App Settings',
            subtitle: 'Configure language & alerts',
            icon: 'cog',
            color: "#64748B",
            screen: 'Settings'
        },
    ];

    return (
        <View style={styles.container}>
            <LinearGradient colors={["#F8FAFC", "#F1F5F9"]} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <MotiView
                    from={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={styles.header}
                >
                    <View style={styles.avatarGlow}>
                        <View style={styles.avatarContainer}>
                            <MaterialCommunityIcons name="account" size={60} color={COLORS.primary} />
                        </View>
                    </View>
                    <Text style={styles.name}>{user?.name || 'Authorized User'}</Text>
                    <Text style={styles.role}>HEALTH REPRESENTATIVE</Text>
                    <View style={styles.badge}>
                        <MaterialCommunityIcons name="check-decagram" size={16} color={COLORS.secondary} />
                        <Text style={styles.badgeText}>Verified Account</Text>
                    </View>
                </MotiView>

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>24</Text>
                        <Text style={styles.statLabel}>Patients</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>12</Text>
                        <Text style={styles.statLabel}>Reports</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>98%</Text>
                        <Text style={styles.statLabel}>Accuracy</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Operational Services</Text>
                {ACTIONS.map((action, i) => (
                    <MotiView
                        key={action.screen}
                        from={{ opacity: 0, translateX: -20 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        transition={{ delay: 200 + i * 100 }}
                    >
                        <TouchableOpacity
                            style={styles.actionItem}
                            onPress={() => navigation.navigate(action.screen)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.iconBox, { backgroundColor: 'rgba(37, 99, 235, 0.08)' }]}>
                                <MaterialCommunityIcons name={action.icon} size={24} color={action.color} />
                            </View>
                            <View style={styles.actionInfo}>
                                <Text style={styles.actionTitle}>{action.title}</Text>
                                <Text style={styles.actionSub}>{action.subtitle}</Text>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.subText} />
                        </TouchableOpacity>
                    </MotiView>
                ))}

                <TouchableOpacity
                    style={styles.logoutBtn}
                    onPress={logout}
                    activeOpacity={0.8}
                >
                    <MaterialCommunityIcons name="logout-variant" size={20} color="white" style={{ marginRight: 8 }} />
                    <Text style={styles.logoutText}>Security Logout</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.version}>v2.4.0 Medical Core</Text>
                    <Text style={styles.copy}>AQUAGUARD SYSTEM SECURE</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8FAFC" },
    content: { padding: 24, paddingTop: 60, paddingBottom: 40 },
    header: { alignItems: 'center', marginBottom: 30 },
    avatarGlow: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.glow(COLORS.primary, 15, 0.1),
        borderWidth: 4,
        borderColor: 'rgba(37, 99, 235, 0.15)'
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.surfaceSecondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary, marginTop: 16 },
    role: { fontSize: 13, fontWeight: '700', color: COLORS.primary, letterSpacing: 1.5, marginTop: 4 },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#F0FDF4",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 12,
        borderWidth: 1,
        borderColor: "#DCFCE7"
    },
    badgeText: { fontSize: 12, fontWeight: '700', color: "#166534", marginLeft: 6 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
    statCard: {
        flex: 1,
        backgroundColor: 'white',
        marginHorizontal: 5,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        ...SHADOWS.small
    },
    statValue: { fontSize: 18, fontWeight: '800', color: "#0F172A" },
    statLabel: { fontSize: 12, fontWeight: '600', color: "#64748B", marginTop: 4 },
    sectionTitle: { fontSize: 15, fontWeight: '800', color: "#64748B", marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 18,
        marginBottom: 12,
        ...SHADOWS.small
    },
    iconBox: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    actionInfo: { flex: 1 },
    actionTitle: { fontSize: 16, fontWeight: '700', color: "#0F172A" },
    actionSub: { fontSize: 13, color: "#64748B", marginTop: 2 },
    logoutBtn: {
        backgroundColor: "#EF4444",
        padding: 18,
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        ...SHADOWS.medium
    },
    logoutText: { color: 'white', fontSize: 16, fontWeight: '700' },
    footer: { marginTop: 40, alignItems: 'center', opacity: 0.5 },
    version: { fontSize: 11, fontWeight: '700', color: "#64748B" },
    copy: { fontSize: 9, fontWeight: '600', color: "#64748B", marginTop: 4, letterSpacing: 2 },
});
