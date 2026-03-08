import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { CartesianChart, Line, Area, useChartPressState } from 'victory-native';
import { useFont, vec, LinearGradient } from '@shopify/react-native-skia';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme/restyleTheme';
import Text from '../atoms/Text';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface DataPoint {
    timestamp: number;
    value: number;
}

interface SensorLineChartProps {
    data: DataPoint[];
    thresholdLow?: number;
    thresholdHigh?: number;
    color?: string;
    label?: string;
}

export function SensorLineChart({
    data,
    thresholdLow,
    thresholdHigh,
    color = '#00E5FF',
    label
}: SensorLineChartProps) {
    const theme = useTheme<Theme>();

    // Safety check for Skia objects that might be undefined on web initial load
    let font = null;
    try {
        font = useFont(null, 11);
    } catch (e) {
        console.warn('Skia font loading failed, using fallback');
    }

    const { state, isActive } = useChartPressState({ x: 0, y: { value: 0 } });

    if (Platform.OS === 'web' && (!data || data.length === 0)) {
        return <View style={[styles.container, { height: 200, justifyContent: 'center', alignItems: 'center' }]}><Text>No Data Available</Text></View>;
    }

    if (Platform.OS === 'web') {
        return (
            <View style={[styles.container, { height: 200, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(15, 23, 42, 0.02)' }]}>
                <Text variant="caption" style={{ color: theme.colors.primary, fontWeight: '700' }}>{label?.toUpperCase()}</Text>
                <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={40} color={theme.colors.primary + '40'} />
                <Text variant="caption" style={{ marginTop: 10 }}>Live Analytics optimized for mobile</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {label && <Text variant="caption" style={{ marginBottom: 10 }}>{label.toUpperCase()}</Text>}
            <View style={{ height: 200, width: '100%' }}>
                <CartesianChart
                    // @ts-ignore
                    data={data}
                    // @ts-ignore
                    xKey="x"
                    // @ts-ignore
                    yKeys={["y"]}
                    // @ts-ignore
                    domainPadding={{ top: 30, bottom: 30, left: 15, right: 15 }}
                    axisOptions={{
                        font,
                        labelColor: theme.colors.textMuted,
                        lineColor: 'rgba(15, 23, 42, 0.05)'
                    }}
                    // @ts-ignore
                    chartPressState={state}
                >
                    {({ points, chartBounds }: any) => (
                        <>
                            <Area
                                points={points.y}
                                y0={chartBounds.bottom}
                                color={color}
                                opacity={0.1}
                                animate={{ type: 'timing', duration: 500 }}
                            />
                            <Line
                                points={points.y}
                                color={color}
                                strokeWidth={3}
                                animate={{ type: "timing", duration: 500 }}
                            />
                        </>
                    )}
                </CartesianChart>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(15, 23, 42, 0.05)',
        marginBottom: 16,
    },
});

export default SensorLineChart;
