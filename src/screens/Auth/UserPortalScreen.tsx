import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, GRADIENTS, SPACE, SPRING, SHADOWS } from '../../constants/theme';
import { ROLES, ROLE_LABELS, ROLE_COLORS, Role } from '../../constants/roles';
import GlassCard from '../../components/GlassCard';
import SectionHeader from '../../components/SectionHeader';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';

type RoleIcon = keyof typeof MaterialCommunityIcons.glyphMap;

const ROLE_ICONS: Partial<Record<Role, RoleIcon>> = {
    [ROLES.OPTIMUS_X]: 'robot-industrial',
    [ROLES.ASHA_WORKER]: 'doctor',
    [ROLES.HEALTH_OFFICIAL]: 'office-building',
    [ROLES.COMMUNITY_MEMBER]: 'account-group',
    [ROLES.VILLAGE_LEADER]: 'crown',
};

interface UserPortalScreenProps {
    navigation: NativeStackNavigationProp<AuthStackParamList, 'UserPortal'>;
}

export default function UserPortalScreen({ navigation }: UserPortalScreenProps) {
    const handleRoleSelect = (role: string) => {
        navigation.navigate('Login', { role });
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <MotiView
                    from={{ translateY: -30, opacity: 0 }}
                    animate={{ translateY: 0, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15 } as any}
                    style={styles.header}
                >
                    <View style={styles.iconCircle}>
                        <MaterialCommunityIcons name="shield-check-outline" size={40} color={COLORS.primary} />
                    </View>
                    <Text style={styles.title}>System Access</Text>
                    <Text style={styles.subtitle}>Select your institutional portal</Text>
                </MotiView>

                <View style={styles.contentContainer}>
                    <SectionHeader title="Available Portals" style={{ width: '100%' }} />

                    <View style={styles.grid}>
                        {Object.values(ROLES).map((role, i) => (
                            <MotiView
                                key={role}
                                from={{ translateY: 50, opacity: 0 }}
                                animate={{ translateY: 0, opacity: 1 }}
                                transition={{ delay: 200 + i * 100, type: 'spring', ...SPRING.gentle } as any}
                            >
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => handleRoleSelect(role)}
                                >
                                    <GlassCard style={styles.roleCard}>
                                        <LinearGradient
                                            colors={[ROLE_COLORS[role] + '15', 'transparent']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={styles.roleGradient}
                                        />
                                        <View style={styles.roleCardInner}>
                                            <View style={[styles.roleIconContainer, { backgroundColor: ROLE_COLORS[role] + '15' }]}>
                                                <MaterialCommunityIcons name={ROLE_ICONS[role as Role] || 'account-circle'} size={30} color={ROLE_COLORS[role]} />
                                            </View>
                                            <View style={styles.roleInfo}>
                                                <Text style={[styles.roleName, { color: ROLE_COLORS[role] }]}>{ROLE_LABELS[role]}</Text>
                                                <Text style={styles.roleDesc}>Access specialized tools & reports</Text>
                                            </View>
                                            <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.textMuted} />
                                        </View>
                                    </GlassCard>
                                </TouchableOpacity>
                            </MotiView>
                        ))}
                    </View>
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
        alignItems: 'center',
    },
    contentContainer: {
        width: '100%',
        maxWidth: 750,
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
        ...(SHADOWS.glow(COLORS.primary, 20, 0.1) as ViewStyle),
    },
    title: {
        ...FONTS.extraBold,
        fontSize: 32,
        color: COLORS.text, // Fixed from textPrimary to text for consistency
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
        width: '100%',
    },
    roleCard: {
        marginBottom: 12,
        marginVertical: 0,
        width: '100%',
    },
    roleCardInner: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    roleGradient: {
        position: 'absolute',
        top: -16, left: -16, right: -16, bottom: -16,
        borderRadius: SIZES.radiusLg,
    },
    roleIconContainer: {
        width: 52,
        height: 52,
        borderRadius: 14,
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