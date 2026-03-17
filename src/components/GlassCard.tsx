import React, { ReactNode } from 'react';
import { StyleSheet, View, Platform, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS, SIZES, GLASS, SHADOWS } from '../constants/theme';
import { MotiView } from 'moti';

interface GlassCardProps {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
    variant?: 'default' | 'elevated' | 'heavy' | 'light' | 'medium';
    intensity?: number;
    animate?: boolean;
}

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
}: GlassCardProps) {
    const config = GLASS[variant] || GLASS.default;
    const blurIntensity = intensity || config.blur;

    // Cross-platform container styles
    const glassStyle = Platform.select<any>({
        ios: {
            backgroundColor: config.bg || 'rgba(255, 255, 255, 0.7)',
            borderWidth: 1,
            borderColor: config.border || 'rgba(15, 23, 42, 0.08)',
            ...(variant === 'elevated' || variant === 'heavy' ? SHADOWS.medium : SHADOWS.small),
        } as ViewStyle,
        android: {
            backgroundColor: config.bg || 'rgba(255, 255, 255, 0.7)',
            borderWidth: 1,
            borderColor: config.border || 'rgba(15, 23, 42, 0.08)',
            ...(variant === 'elevated' || variant === 'heavy' ? SHADOWS.medium : SHADOWS.small),
        } as ViewStyle,
        web: {
            backgroundColor: config.bg || 'rgba(255, 255, 255, 0.7)',
            backdropFilter: `blur(${blurIntensity / 2}px)`,
            WebkitBackdropFilter: `blur(${blurIntensity / 2}px)`,
            borderWidth: 1,
            borderColor: config.border || 'rgba(15, 23, 42, 0.08)',
            boxShadow: variant === 'elevated' || variant === 'heavy'
                ? '0px 10px 40px rgba(15, 23, 42, 0.06)'
                : '0px 4px 20px rgba(15, 23, 42, 0.04)',
        } as any, // Cast to any because backdropFilter is web-only
        native: {
            backgroundColor: config.bg,
            borderWidth: 1,
            borderColor: config.border,
            ...(variant === 'elevated' || variant === 'heavy' ? SHADOWS.medium : SHADOWS.small),
        } as ViewStyle
    });

    const content = Platform.OS === 'web' ? (
        <View style={[styles.inner, glassStyle as ViewStyle]}>
            {children}
        </View>
    ) : (
        <BlurView
            intensity={blurIntensity}
            tint="light"
            style={[styles.blur, glassStyle as ViewStyle]}
        >
            <View style={styles.inner}>
                {children}
            </View>
        </BlurView>
    );

    const containerStyle = [styles.card, style];

    if (!animate) return <View style={containerStyle}>{content}</View>;

    return (
        <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 150 }}
            style={containerStyle}
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
        width: '100%',
    },
    inner: {
        padding: 16,
        borderRadius: SIZES.radiusLg,
        width: '100%',
    },
});