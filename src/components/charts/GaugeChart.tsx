import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';
import Animated, { useAnimatedProps, withSpring } from 'react-native-reanimated';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme/restyleTheme';

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
    size = 120
}: GaugeChartProps) {
    const theme = useTheme<Theme>();
    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.4;

    const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
    const filled = (percentage / 100) * 240;

    const getColor = (val: number) => {
        if (val < 15) return '#3B82F6'; // Cold
        if (val < 30) return theme.colors.success; // Normal
        return theme.colors.danger; // Hot
    };

    const color = getColor(value);

    return (
        <View style={{ alignItems: 'center', width: size, height: size }}>
            <Svg width={size} height={size}>
                <Path
                    d={arcPath(cx, cy, r, 150, 390)}
                    stroke="rgba(15, 23, 42, 0.05)"
                    strokeWidth={10}
                    fill="none"
                    strokeLinecap="round"
                />
                <Path
                    d={arcPath(cx, cy, r, 150, 150 + filled)}
                    stroke={color}
                    strokeWidth={10}
                    fill="none"
                    strokeLinecap="round"
                />
                <SvgText
                    x={cx}
                    y={cy - 5}
                    textAnchor="middle"
                    fontSize={22}
                    fill={theme.colors.text}
                    fontWeight="bold"
                >
                    {value}
                </SvgText>
                <SvgText
                    x={cx}
                    y={cy + 15}
                    textAnchor="middle"
                    fontSize={12}
                    fill={theme.colors.textMuted}
                >
                    {unit}
                </SvgText>
            </Svg>
            {label && (
                <View style={{ marginTop: -10 }}>
                    <Text variant="caption" style={{ fontWeight: '700' }}>{label.toUpperCase()}</Text>
                </View>
            )}
        </View>
    );
}

import Text from '../atoms/Text';
export default GaugeChart;
