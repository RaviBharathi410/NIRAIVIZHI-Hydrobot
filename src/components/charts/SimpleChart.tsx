import React, { useState } from 'react';
import { View, Text, StyleSheet, LayoutChangeEvent } from 'react-native';
import Svg, { Rect, G, LinearGradient, Stop, Line, Defs } from 'react-native-svg';
import { MotiView } from 'moti';
import { COLORS, FONTS, SPACE } from '../../constants/theme';

interface SimpleChartProps {
    data: number[];
    labels: string[];
    color?: string;
    height?: number;
    title?: string;
}

export default function SimpleChart({
    data = [],
    labels = [],
    color = COLORS.accent,
    height = 120,
    title
}: SimpleChartProps) {
    const [chartWidth, setChartWidth] = useState(300);
    const maxVal = Math.max(...data, 1);
    const barPadding = 8;
    const barWidth = (chartWidth / Math.max(data.length, 1)) - barPadding;

    const onLayout = (event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        if (width > 0) setChartWidth(width);
    };

    return (
        <View style={styles.container} onLayout={onLayout}>
            {title && <Text style={styles.title}>{title}</Text>}

            <View style={[styles.chartWrapper, { height }]}>
                <Svg width="100%" height={height} viewBox={`0 0 ${chartWidth} ${height}`}>
                    <Defs>
                        <LinearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0%" stopColor={color} />
                            <Stop offset="100%" stopColor={color + '33'} />
                        </LinearGradient>
                    </Defs>

                    {/* Grid lines */}
                    <Line x1="0" y1={height * 0.25} x2={chartWidth} y2={height * 0.25} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <Line x1="0" y1={height * 0.5} x2={chartWidth} y2={height * 0.5} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <Line x1="0" y1={height * 0.75} x2={chartWidth} y2={height * 0.75} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                    <G>
                        {data.map((val, i) => {
                            const barHeight = (val / maxVal) * (height - 20);
                            const x = i * (barWidth + barPadding);

                            return (
                                <MotiView
                                    key={i}
                                    from={{ scaleY: 0, opacity: 0 }}
                                    animate={{ scaleY: 1, opacity: 1 }}
                                    transition={{
                                        type: 'spring',
                                        delay: i * 100,
                                        damping: 15
                                    }}
                                    style={{
                                        position: 'absolute',
                                        left: x,
                                        bottom: 10,
                                        width: barWidth,
                                        height: barHeight,
                                    }}
                                >
                                    <Svg width={barWidth} height={barHeight}>
                                        <Rect
                                            x={0}
                                            y={0}
                                            width={barWidth}
                                            height={barHeight}
                                            rx={4}
                                            fill="url(#barGrad)"
                                        />
                                    </Svg>
                                </MotiView>
                            );
                        })}
                    </G>
                </Svg>
            </View>

            <View style={styles.labelRow}>
                {labels.map((label, i) => (
                    <Text key={i} style={styles.label}>{label}</Text>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: SPACE[2],
    },
    title: {
        ...FONTS.semiBold,
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: SPACE[3],
    },
    chartWrapper: {
        width: '100%',
        justifyContent: 'flex-end',
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
    },
    label: {
        ...FONTS.regular,
        fontSize: 10,
        color: COLORS.textMuted,
        textAlign: 'center',
        flex: 1,
    },
});