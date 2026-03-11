import React, { useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import Svg, { Polyline, Defs, LinearGradient, Stop, Polygon, Line } from 'react-native-svg';
import { COLORS } from '../../constants/theme';

interface LineConfig {
    key: string;
    color: string;
    strokeWidth?: number;
    filled?: boolean;
}

interface WebLineChartProps {
    /** Array of data objects */
    data: Record<string, any>[];
    /** Key used for x-axis (string labels) */
    xKey: string;
    /** One or more line configs */
    lines: LineConfig[];
    /** Height of the chart area */
    height?: number;
}

/**
 * Universal SVG line chart — works on web AND native.
 * Drop-in replacement for CartesianChart from victory-native.
 */
export default function WebLineChart({
    data,
    xKey,
    lines,
    height = 160,
}: WebLineChartProps) {
    const [width, setWidth] = useState(300);

    if (!data || data.length === 0) return null;

    const handleLayout = (e: LayoutChangeEvent) => {
        const w = e.nativeEvent.layout.width;
        if (w > 0) setWidth(w);
    };

    const pad = { top: 10, bottom: 10, left: 4, right: 4 };
    const chartW = width - pad.left - pad.right;
    const chartH = height - pad.top - pad.bottom;

    const getPoints = (key: string) => {
        const vals = data.map(d => Number(d[key]) || 0);
        const maxV = Math.max(...vals, 1);
        const minV = Math.min(...vals, 0);
        const range = maxV - minV || 1;

        return data.map((d, i) => {
            const x = pad.left + (i / (data.length - 1)) * chartW;
            const y = pad.top + chartH - ((Number(d[key]) - minV) / range) * chartH;
            return `${x.toFixed(1)},${y.toFixed(1)}`;
        }).join(' ');
    };

    return (
        <View style={[styles.container, { height }]} onLayout={handleLayout}>
            <Svg width="100%" height={height}>
                <Defs>
                    {lines.map(l => (
                        <LinearGradient key={l.key + '_grad'} id={l.key + '_grad'} x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0%" stopColor={l.color} stopOpacity="0.25" />
                            <Stop offset="100%" stopColor={l.color} stopOpacity="0.02" />
                        </LinearGradient>
                    ))}
                </Defs>

                {/* Grid lines */}
                {[0.25, 0.5, 0.75].map((frac, i) => (
                    <Line
                        key={i}
                        x1={pad.left}
                        y1={pad.top + chartH * frac}
                        x2={width - pad.right}
                        y2={pad.top + chartH * frac}
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="1"
                    />
                ))}

                {/* Area fill + line for each series */}
                {lines.map(l => {
                    const pts = getPoints(l.key);
                    const firstPt = pts.split(' ')[0];
                    const lastPt = pts.split(' ').slice(-1)[0];
                    const [lastX] = lastPt.split(',');
                    const fillPts = `${pad.left},${pad.top + chartH} ${pts} ${lastX},${pad.top + chartH}`;

                    return (
                        <React.Fragment key={l.key}>
                            {/* Area */}
                            <Polygon
                                points={fillPts}
                                fill={`url(#${l.key}_grad)`}
                            />
                            {/* Line */}
                            <Polyline
                                points={pts}
                                fill="none"
                                stroke={l.color}
                                strokeWidth={l.strokeWidth ?? 3}
                                strokeLinejoin="round"
                                strokeLinecap="round"
                            />
                        </React.Fragment>
                    );
                })}
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        overflow: 'hidden',
    },
});
