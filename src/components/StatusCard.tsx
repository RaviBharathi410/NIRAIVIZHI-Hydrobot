import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { COLORS, FONTS, SIZES, SPACE } from '../constants/theme';
import GlassCard from './GlassCard';
import RingGauge from './RingGauge';
import IconBadge from './IconBadge';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface StatusCardProps {
    title: string;
    value: string;
    unit: string;
    status?: 'safe' | 'moderate' | 'unsafe' | 'default' | 'info';
    icon: string;
    subtitle?: string;
    style?: StyleProp<ViewStyle>;
}

export default function StatusCard({ title, value, unit, status = 'safe', icon, subtitle, style }: StatusCardProps) {
    const statusColor = status === 'safe' ? COLORS.success
        : status === 'moderate' ? COLORS.warning
            : status === 'unsafe' ? COLORS.danger
                : COLORS.textSecondary;

    // Map emoji icons to MaterialCommunityIcons if possible, or use as fallback
    const getIcon = (): keyof typeof MaterialCommunityIcons.glyphMap => {
        if (icon === '💧') return 'water';
        if (icon === '🧪') return 'test-tube';
        if (icon === '🌊') return 'waves';
        if (icon === '🤖') return 'robot';
        if (icon === '⚡') return 'flash';
        return 'circle';
    };

    return (
        <GlassCard style={[styles.card, style]}>
            <View style={styles.header}>
                <IconBadge icon={getIcon()} size={36} color={statusColor} glow={false} />
                <View style={styles.titleContainer}>
                    <Text style={styles.title} numberOfLines={1}>{title}</Text>
                    <Text style={[styles.statusText, { color: statusColor }]}>{status.toUpperCase()}</Text>
                </View>
            </View>

            <View style={styles.gaugeContainer}>
                <RingGauge
                    value={parseFloat(value)}
                    maxValue={status === 'safe' ? 1000 : 500} // Dynamic max for demo
                    size={100}
                    strokeWidth={8}
                    color={statusColor}
                    unit={unit}
                />
            </View>

            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </GlassCard>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 170,
        marginRight: SPACE[3],
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACE[3],
    },
    titleContainer: {
        marginLeft: 10,
        flex: 1,
    },
    title: {
        ...FONTS.medium,
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    statusText: {
        ...FONTS.bold,
        fontSize: 10,
        letterSpacing: 1,
    },
    gaugeContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    subtitle: {
        ...FONTS.regular,
        fontSize: 11,
        color: COLORS.textMuted,
        textAlign: 'center',
        marginTop: 4,
    },
});