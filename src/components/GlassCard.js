import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS, SIZES, GLASS, SHADOWS } from '../constants/theme';
import { MotiView } from 'moti';

/**
 * Standard GlassCard component with cross-platform support.
 * Uses BlurView for mobile and backdrop-filter for web.
 */
export default function GlassCard({
    children,
    style,
    variant = 'default',
    intensity,
    animate = true
}) {
    const config = GLASS[variant] || GLASS.default;
    const blurIntensity = intensity || config.blur;

    // Cross-platform container styles
    const glassStyle = Platform.select({
        web: {
            backgroundColor: config.bg || 'rgba(30, 41, 59, 0.5)',
            backdropFilter: `blur(${blurIntensity / 2}px)`,
            WebkitBackdropFilter: `blur(${blurIntensity / 2}px)`,
            borderWidth: 1,
            borderColor: config.border || 'rgba(255, 255, 255, 0.08)',
            boxShadow: variant === 'elevated' || variant === 'heavy'
                ? '0px 8px 32px rgba(0,0,0,0.4)'
                : '0px 4px 16px rgba(0,0,0,0.2)',
        },
        default: {
            backgroundColor: config.bg,
            borderWidth: 1,
            borderColor: config.border,
            ...(variant === 'elevated' || variant === 'heavy' ? SHADOWS.medium : SHADOWS.small),
        }
    });

    const content = Platform.OS === 'web' ? (
        <View style={[styles.inner, style, glassStyle]}>
            {children}
        </View>
    ) : (
        <BlurView intensity={blurIntensity} tint="dark" style={[styles.blur, style, { borderColor: config.border || COLORS.border }]}>
            <View style={[styles.inner, { borderBottomWidth: 0, borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0 }]}>
                {children}
            </View>
        </BlurView>
    );

    if (!animate) return <View style={[styles.card, Platform.OS !== 'web' && glassStyle]}>{content}</View>;

    return (
        <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 150 }}
            style={[styles.card, Platform.OS !== 'web' && glassStyle]}
        >
            {content}
        </MotiView>
    );
}

const styles = StyleSheet.create({
    card: {
        marginVertical: 8,
        borderRadius: SIZES.radiusLg,
        overflow: 'hidden',
    },
    blur: {
        borderRadius: SIZES.radiusLg,
        borderWidth: 1,
    },
    inner: {
        padding: 16,
        borderRadius: SIZES.radiusLg,
    },
});