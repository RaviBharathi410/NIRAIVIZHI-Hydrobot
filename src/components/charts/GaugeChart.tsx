import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withSpring, interpolateColor } from 'react-native-reanimated';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../constants/restyleTheme';
import Text from '../atoms/Text';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface GaugeChartProps {
    value: number;
    min?: number;
    max?: number;
    label?: string;
    unit?: string;
    size?: number;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
    const s = polarToCartesian(cx, cy, r, startAngle);
    const e = polarToCartesian(cx, cy, r, endAngle);
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

export function GaugeChart({
    value,
    min = 0,
    max = 50,
    label,
    unit = '°C',
    size = 140
}: GaugeChartProps) {
    const theme = useTheme<Theme>();
    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.38;

    const progress = useSharedValue(0);

    useEffect(() => {
        const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
        progress.value = withSpring(percentage, { damping: 15 });
    }, [value]);

    const animatedProps = useAnimatedProps(() => {
        const filledArc = (progress.value / 100) * 240;
        return {
            d: arcPath(cx, cy, r, 150, 150 + filledArc),
            stroke: interpolateColor(
                progress.value,
                [0, 50, 100],
                ['#3B82F6', theme.colors.success as string, theme.colors.danger as string]
            )
        };
    });

    return (
        <View style={[styles.container, { width: size, height: size + 20 }]}>
            <Svg width={size} height={size}>
                <Path
                    d={arcPath(cx, cy, r, 150, 390)}
                    stroke={theme.colors.border as string}
                    strokeWidth={10}
                    fill="none"
                    strokeLinecap="round"
                    opacity={0.1}
                />
                <AnimatedPath
                    animatedProps={animatedProps}
                    strokeWidth={10}
                    fill="none"
                    strokeLinecap="round"
                />
                <SvgText
                    x={cx}
                    y={cy + 8}
                    textAnchor="middle"
                    fontSize={24}
                    fill={theme.colors.text as string}
                    fontWeight="bold"
                >
                    {value.toFixed(1)}
                </SvgText>
                <SvgText
                    x={cx}
                    y={cy + 24}
                    textAnchor="middle"
                    fontSize={10}
                    fill={theme.colors.textMuted as string}
                >
                    {unit}
                </SvgText>
            </Svg>
            {label && (
                <Text variant="caption" style={styles.label}>
                    {label.toUpperCase()}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        marginTop: -10,
        fontWeight: '700',
        letterSpacing: 1,
    },
});

export default GaugeChart;
