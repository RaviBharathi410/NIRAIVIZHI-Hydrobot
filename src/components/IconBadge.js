import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, GRADIENTS, SHADOWS } from '../constants/theme';
import { MotiView } from 'moti';

export default function IconBadge({
    icon,
    size = 48,
    color = COLORS.accent,
    gradient,
    glow = true
}) {
    const iconSize = size * 0.5;

    return (
        <MotiView
            from={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            style={[
                styles.container,
                { width: size, height: size, borderRadius: size / 2 },
                glow && SHADOWS.glow(color, 12, 0.3)
            ]}
        >
            <LinearGradient
                colors={gradient || [color + '20', color + '40']}
                style={[styles.gradient, { borderRadius: size / 2 }]}
            >
                <MaterialCommunityIcons name={icon} size={iconSize} color={color} />
            </LinearGradient>
        </MotiView>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    gradient: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
});
