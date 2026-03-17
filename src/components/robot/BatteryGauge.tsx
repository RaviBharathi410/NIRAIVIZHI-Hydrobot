import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../constants/restyleTheme';

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

interface BatteryGaugeProps {
    percent: number;
    size?: number;
}

export function BatteryGauge({ percent, size = 80 }: BatteryGaugeProps) {
    const theme = useTheme<Theme>();
    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.38;
    const filled = (percent / 100) * 240;

    const color = percent > 50
        ? theme.colors.success
        : percent > 20
            ? theme.colors.warning
            : theme.colors.danger;

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={size} height={size}>
                {/* Background track */}
                <Path
                    d={arcPath(cx, cy, r, 150, 390)}
                    stroke={theme.colors.border as string}
                    strokeWidth={8}
                    fill="none"
                    strokeLinecap="round"
                    opacity={0.3}
                />
                {/* Filled progress */}
                <Path
                    d={arcPath(cx, cy, r, 150, 150 + filled)}
                    stroke={color as string}
                    strokeWidth={8}
                    fill="none"
                    strokeLinecap="round"
                />
                <SvgText
                    x={cx}
                    y={cy + 6}
                    textAnchor="middle"
                    fontSize={14}
                    fill={color as string}
                    fontWeight="bold"
                >
                    {percent}%
                </SvgText>
            </Svg>
        </View>
    );
}

export default BatteryGauge;
