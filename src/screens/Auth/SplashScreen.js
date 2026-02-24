import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, MotiText } from 'moti';
import { COLORS, FONTS, SIZES, GRADIENTS, SPRING } from '../../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('LanguageSelection');
        }, 3500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen} style={StyleSheet.absoluteFill} />

            {/* Animated background particles */}
            {[...Array(6)].map((_, i) => (
                <MotiView
                    key={i}
                    from={{ translateY: 0, opacity: 0.1 }}
                    animate={{ translateY: -100, opacity: 0 }}
                    transition={{
                        loop: true,
                        duration: 3000 + i * 1000,
                        delay: i * 500,
                        type: 'timing',
                    }}
                    style={[
                        styles.particle,
                        { left: (width / 5) * i, width: 4 + i, height: 4 + i }
                    ]}
                />
            ))}

            <View style={styles.content}>
                <MotiView
                    from={{ scale: 0.5, opacity: 0, rotate: '-10deg' }}
                    animate={{ scale: 1, opacity: 1, rotate: '0deg' }}
                    transition={{ type: 'spring', ...SPRING.bouncy }}
                    style={styles.logoWrapper}
                >
                    <LinearGradient colors={GRADIENTS.primary} style={styles.logoCircle}>
                        <MaterialCommunityIcons name="robot-industrial" size={60} color={COLORS.white} />
                    </LinearGradient>
                    <MotiView
                        from={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', delay: 500 }}
                        style={styles.glow}
                    />
                </MotiView>

                <MotiText
                    from={{ opacity: 0, translateY: 10 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: 800, type: 'timing' }}
                    style={styles.title}
                >
                    AquaGuard
                </MotiText>

                <MotiText
                    from={{ opacity: 0, translateY: 10 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: 1000, type: 'timing' }}
                    style={styles.subtitle}
                >
                    OPTIMUS X
                </MotiText>

                <MotiView
                    from={{ width: 0 }}
                    animate={{ width: 120 }}
                    transition={{ delay: 1200, duration: 1500, type: 'timing' }}
                    style={styles.loader}
                >
                    <LinearGradient
                        colors={GRADIENTS.accent}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={StyleSheet.absoluteFill}
                    />
                </MotiView>
            </View>

            <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2000 }}
                style={styles.footer}
            >
                <Text style={styles.footerText}>AI-Powered Water Intelligence</Text>
            </MotiView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
    },
    logoWrapper: {
        marginBottom: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    glow: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: COLORS.accent,
        opacity: 0.2,
        zIndex: 1,
    },
    title: {
        ...FONTS.extraBold,
        fontSize: 42,
        color: COLORS.text,
        letterSpacing: 2,
    },
    subtitle: {
        ...FONTS.bold,
        fontSize: 28,
        color: COLORS.accent,
        marginTop: -5,
        letterSpacing: 8,
    },
    loader: {
        height: 4,
        borderRadius: 2,
        marginTop: 40,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    particle: {
        position: 'absolute',
        bottom: 0,
        borderRadius: 10,
        backgroundColor: COLORS.accent,
    },
    footer: {
        position: 'absolute',
        bottom: 60,
    },
    footerText: {
        ...FONTS.medium,
        fontSize: 14,
        color: COLORS.textSecondary,
        letterSpacing: 1,
    },
});