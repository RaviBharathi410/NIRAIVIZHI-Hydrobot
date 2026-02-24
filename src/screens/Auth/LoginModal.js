import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Dimensions, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, GRADIENTS, SPACE, SPRING } from '../../constants/theme';
import { ROLE_LABELS, ROLE_COLORS } from '../../constants/roles';
import { useAuth } from '../../context/AuthContext';
import AnimatedButton from '../../components/AnimatedButton';
import GlassCard from '../../components/GlassCard';

export default function LoginModal({ navigation, route }) {
    const { role = 'optimusx' } = route?.params || {};
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!username.trim()) {
            setError('Required field');
            return;
        }
        setLoading(true);
        setError('');

        // Simulate auth
        setTimeout(async () => {
            await login({ name: username, role, id: Date.now().toString() });
            setLoading(false);
        }, 1500);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <LinearGradient colors={GRADIENTS.screen} style={StyleSheet.absoluteFill} />

            <MotiView
                from={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', ...SPRING.gentle }}
                style={styles.modalWrapper}
            >
                <GlassCard style={styles.modal} variant="elevated">
                    <View style={[styles.headerIcon, { backgroundColor: COLORS.primaryLight }]}>
                        <MaterialCommunityIcons name="lock-outline" size={32} color={COLORS.primary} />
                    </View>

                    <Text style={styles.title}>Secure Login</Text>
                    <Text style={styles.subtitle}>Institutional access for {ROLE_LABELS[role]}</Text>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Identity / Username</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialCommunityIcons name="account-outline" size={20} color={COLORS.textMuted} style={styles.fieldIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={username}
                                    onChangeText={setUsername}
                                    placeholder="Enter your ID"
                                    placeholderTextColor={COLORS.textMuted}
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Security Key</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialCommunityIcons name="key-outline" size={20} color={COLORS.textMuted} style={styles.fieldIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="••••••••"
                                    placeholderTextColor={COLORS.textMuted}
                                    secureTextEntry
                                />
                            </View>
                        </View>

                        {error ? (
                            <MotiView from={{ opacity: 0, translateX: -5 }} animate={{ opacity: 1, translateX: 0 }} style={styles.errorContainer}>
                                <MaterialCommunityIcons name="alert-circle" size={16} color={COLORS.danger} />
                                <Text style={styles.errorText}>{error}</Text>
                            </MotiView>
                        ) : null}

                        <AnimatedButton
                            title="Authenticate"
                            onPress={handleLogin}
                            loading={loading}
                            variant="primary"
                            style={styles.submitBtn}
                            iconRight="login"
                        />

                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.backBtn}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.backText}>Cancel & Go Back</Text>
                        </TouchableOpacity>
                    </View>
                </GlassCard>
            </MotiView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACE[4],
    },
    modalWrapper: {
        width: '100%',
        maxWidth: 400,
    },
    modal: {
        padding: SPACE[6],
        alignItems: 'center',
    },
    headerIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        ...FONTS.bold,
        fontSize: 28,
        color: COLORS.text,
    },
    subtitle: {
        ...FONTS.medium,
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: SPACE[6],
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        ...FONTS.semiBold,
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: SIZES.radius,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        paddingHorizontal: 16,
    },
    fieldIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: 54,
        color: COLORS.text,
        ...FONTS.medium,
        fontSize: 16,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    errorText: {
        ...FONTS.bold,
        fontSize: 12,
        color: COLORS.danger,
        marginLeft: 6,
    },
    submitBtn: {
        marginTop: 10,
        height: 58,
    },
    backBtn: {
        marginTop: 20,
        alignItems: 'center',
    },
    backText: {
        ...FONTS.medium,
        fontSize: 14,
        color: COLORS.textMuted,
    },
});