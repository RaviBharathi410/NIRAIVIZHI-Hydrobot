import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, GRADIENTS, SPRING, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

export default function LogoutScreen({ navigation }) {
    const { logout } = useAuth();

    useEffect(() => {
        const timer = setTimeout(async () => {
            await logout();
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen} style={StyleSheet.absoluteFill} />

            <MotiView
                from={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', ...SPRING.bouncy }}
                style={styles.content}
            >
                <LinearGradient colors={GRADIENTS.primary} style={styles.iconCircle}>
                    <MaterialCommunityIcons name="power" size={50} color={COLORS.white} />
                </LinearGradient>

                <Text style={styles.title}>Secure Departure</Text>
                <Text style={styles.subtitle}>Disconnecting from Optimus Core...</Text>

                <View style={styles.loader}>
                    <MotiView
                        from={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 2000, type: 'timing' }}
                        style={styles.loaderBar}
                    />
                </View>

                <MotiView
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1000 }}
                >
                    <Text style={styles.footerText}>Saving session diagnostics</Text>
                </MotiView>
            </MotiView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
    content: { alignItems: 'center' },
    iconCircle: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 30, ...SHADOWS.glow(COLORS.primary, 20, 0.3) },
    title: { ...FONTS.extraBold, fontSize: 32, color: COLORS.text },
    subtitle: { ...FONTS.medium, fontSize: 16, color: COLORS.textSecondary, marginTop: 10 },
    loader: { width: 200, height: 4, backgroundColor: COLORS.surfaceLight, borderRadius: 2, marginTop: 40, overflow: 'hidden' },
    loaderBar: { ...StyleSheet.absoluteFillObject, backgroundColor: COLORS.danger },
    footerText: { ...FONTS.bold, fontSize: 12, color: COLORS.textMuted, marginTop: 20, letterSpacing: 1, textTransform: 'uppercase' },
});
