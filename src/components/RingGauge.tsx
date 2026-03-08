import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import Animated, {
    useSharedValue, useAnimatedProps, withTiming, Easing,
} from 'react-native-reanimated';
import { COLORS, FONTS, TEXT, TIMING } from '../constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface RingGaugeProps {
    value?: number;
    maxValue?: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    colorEnd?: string;
    unit?: string;
    label?: string;
    showValue?: boolean;
    animate?: boolean;
    style?: StyleProp<ViewStyle>;
}

export default function RingGauge({
    value = 0,
    maxValue = 100,
    size = 120,
    strokeWidth = 12,
    color = COLORS.accent,
    colorEnd,
    unit = '',
    label,
    showValue = true,
    animate = true,
    style,
}: RingGaugeProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const clampedPct = Math.min(Math.max(value / maxValue, 0), 1);

    const progress = useSharedValue(0);

    useEffect(() => {
        if (animate) {
            progress.value = withTiming(clampedPct, {
                duration: TIMING.slow,
                easing: Easing.out(Easing.cubic),
            });
        } else {
            progress.value = clampedPct;
        }
    }, [value, clampedPct, animate]);

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: circumference * (1 - progress.value),
    }));

    const gradId = `rg_${Math.round(value)}`;
    const cx = size / 2;
    const cy = size / 2;
    const startAngle = -90; // top

    return (
        <View style={[styles.container, { width: size, height: size }, style]}>
            <Svg width={size} height={size}>
                <Defs>
                    <SvgGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor={color} stopOpacity={1} />
                        <Stop offset="100%" stopColor={colorEnd || color} stopOpacity={0.7} />
                    </SvgGradient>
                </Defs>
                {/* Track */}
                <Circle
                    cx={cx} cy={cy} r={radius}
                    stroke="rgba(255,255,255,0.07)"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress arc */}
                <AnimatedCircle
                    cx={cx} cy={cy} r={radius}
                    stroke={`url(#${gradId})`}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    animatedProps={animatedProps}
                    strokeLinecap="round"
                    rotation={startAngle}
                    origin={`${cx},${cy}`}
                />
            </Svg>
            {showValue && (
                <View style={styles.center}>
                    <Text style={[styles.value, { color }]}>{typeof value === 'number' ? value.toFixed(value < 10 && value % 1 !== 0 ? 1 : 0) : value}</Text>
                    {unit ? <Text style={styles.unit}>{unit}</Text> : null}
                    {label ? <Text style={styles.label}>{label}</Text> : null}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    center: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    value: {
        ...FONTS.bold,
        ...TEXT.lg,
    },
    unit: {
        ...FONTS.medium,
        fontSize: 11,
        color: COLORS.textSecondary,
        marginTop: -1,
    },
    label: {
        ...FONTS.regular,
        fontSize: 10,
        color: COLORS.textMuted,
        marginTop: 2,
        textAlign: 'center',
    },
});
