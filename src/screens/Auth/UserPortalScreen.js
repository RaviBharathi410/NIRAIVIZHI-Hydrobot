import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, GRADIENTS, SPACE, SPRING, SHADOWS } from '../../constants/theme';
import { ROLES, ROLE_LABELS, ROLE_COLORS } from '../../constants/roles';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import GlassCard from '../../components/GlassCard';
import SectionHeader from '../../components/SectionHeader';

const ROLE_ICONS = {
    [ROLES.OPTIMUS_X]: 'robot-industrial',
    [ROLES.ASHA_WORKER]: 'doctor',
    [ROLES.HEALTH_OFFICIAL]: 'office-building',
    [ROLES.COMMUNITY_MEMBER]: 'account-group',
    [ROLES.VILLAGE_LEADER]: 'crown',
};

export default function UserPortalScreen({ navigation }) {
    const { t } = useLanguage();
    const { login } = useAuth();

    const handleRoleSelect = (role) => {
        navigation.navigate('Login', { role });
    };


    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <MotiView
                    from={{ translateY: -30, opacity: 0 }}
                    animate={{ translateY: 0, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    style={styles.header}
                >
                    <View style={styles.iconCircle}>
                        <MaterialCommunityIcons name="shield-check-outline" size={40} color={COLORS.primary} />
                    </View>
                    <Text style={styles.title}>System Access</Text>
                    <Text style={styles.subtitle}>Select your institutional portal</Text>
                </MotiView>

                <SectionHeader title="Available Portals" />

                <View style={styles.grid}>
                    {Object.values(ROLES).map((role, i) => (
                        <MotiView
                            key={role}
                            from={{ translateY: 50, opacity: 0 }}
                            animate={{ translateY: 0, opacity: 1 }}
                            transition={{ delay: 200 + i * 100, type: 'spring', ...SPRING.gentle }}
                        >
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => handleRoleSelect(role)}
                            >
                                <GlassCard style={styles.roleCard}>
                                    <LinearGradient
                                        colors={[ROLE_COLORS[role] + '20', 'transparent']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.roleGradient}
                                    />
                                    <View style={[styles.roleIconContainer, { backgroundColor: ROLE_COLORS[role] + '15' }]}>
                                        <MaterialCommunityIcons name={ROLE_ICONS[role]} size={30} color={ROLE_COLORS[role]} />
                                    </View>
                                    <View style={styles.roleInfo}>
                                        <Text style={[styles.roleName, { color: ROLE_COLORS[role] }]}>{ROLE_LABELS[role]}</Text>
                                        <Text style={styles.roleDesc}>Access specialized tools & reports</Text>
                                    </View>
                                    <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.textMuted} />
                                </GlassCard>
                            </TouchableOpacity>
                        </MotiView>
                    ))}
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Powered by AquaGuard Engine</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        padding: SPACE[6],
        paddingTop: 70,
        paddingBottom: 50,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACE[8],
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1.5,
        borderColor: 'rgba(99, 102, 241, 0.1)',
        ...SHADOWS.glow(COLORS.primary, 20, 0.1),
    },
    title: {
        ...FONTS.extraBold,
        fontSize: 32,
        color: COLORS.textPrimary,
    },
    subtitle: {
        ...FONTS.medium,
        fontSize: 15,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginTop: 8,
    },
    grid: {
        marginTop: 10,
    },
    roleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: 'transparent', // Will be set per card if needed
    },
    roleGradient: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: SIZES.radiusLg,
    },
    roleIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    roleInfo: {
        flex: 1,
    },
    roleName: {
        ...FONTS.bold,
        fontSize: 18,
        marginBottom: 2,
    },
    roleDesc: {
        ...FONTS.regular,
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
        opacity: 0.5,
    },
    footerText: {
        ...FONTS.medium,
        fontSize: 12,
        color: COLORS.textMuted,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
});