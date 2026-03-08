import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme/restyleTheme';

interface BatteryGaugeProps {
    percent: number;
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

export function BatteryGauge({ percent, size = 80 }: BatteryGaugeProps) {
    const theme = useTheme<Theme>();
    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.38;
    const filled = (Math.min(100, Math.max(0, percent)) / 100) * 240;

    const color = percent > 50
        ? theme.colors.success
        : percent > 20
            ? theme.colors.warning
            : theme.colors.danger;

    return (
        <View style={{ width: size, height: size }}>
            <Svg width={size} height={size}>
                {/* Background Track */}
                <Path
                    d={arcPath(cx, cy, r, 150, 30 + 360)} // Wrap or adjust angles to match 240deg
                    // Wait, 150 to 30 is 240 degrees (150 -> 390)
                    // Let's re-calculate: 150 to 30 clockwise is 240 degrees.
                    stroke="rgba(15, 23, 42, 0.08)"
                    strokeWidth={8}
                    fill="none"
                    strokeLinecap="round"
                />
                {/* Foreground Filled Arc */}
                <Path
                    d={arcPath(cx, cy, r, 150, 150 + filled)}
                    stroke={color}
                    strokeWidth={8}
                    fill="none"
                    strokeLinecap="round"
                />
                <SvgText
                    x={cx}
                    y={cy + 6}
                    textAnchor="middle"
                    fontSize={14}
                    fill={color}
                    fontWeight="bold"
                >
                    {percent}%
                </SvgText>
            </Svg>
        </View>
    );
}

export default BatteryGauge;
