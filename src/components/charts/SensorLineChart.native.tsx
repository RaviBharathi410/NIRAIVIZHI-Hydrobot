import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { CartesianChart, Line, Area, useChartPressState } from 'victory-native';
import { useFont } from '@shopify/react-native-skia';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../constants/restyleTheme';
import Text from '../atoms/Text';

interface DataPoint {
    timestamp: number;
    value: number;
    [key: string]: number;
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
    thresholdLow = 6.5,
    thresholdHigh = 8.5,
    color = '#00E5FF',
    label
}: SensorLineChartProps) {
    const theme = useTheme<Theme>();
    const font = useFont(null, 11); // Fallback to default
    const { state, isActive } = useChartPressState({ x: 0, y: { value: 0 } });

    // Ensure data is sorted by timestamp
    const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp);

    if (Platform.OS === 'web') {
        return (
            <View style={styles.webFallback}>
                <Text variant="caption" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                    {label?.toUpperCase()}
                </Text>
                <Text variant="caption">Chart optimized for mobile view</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {label && <Text variant="caption" style={styles.label}>{label.toUpperCase()}</Text>}
            <View style={{ height: 220, width: '100%' }}>
                <CartesianChart
                    data={sortedData}
                    xKey="timestamp"
                    yKeys={["value"]}
                    domainPadding={{ top: 20, bottom: 20, left: 10, right: 10 }}
                    axisOptions={{
                        font,
                        labelColor: theme.colors.textMuted,
                        lineColor: theme.colors.border as string,
                        tickCount: 5
                    }}
                    chartPressState={state}
                >
                    {({ points, chartBounds }) => (
                        <>
                            {/* Threshold Lines */}
                            {thresholdLow !== undefined && (
                                <Line
                                    points={[
                                        { x: chartBounds.left, y: thresholdLow },
                                        { x: chartBounds.right, y: thresholdLow }
                                    ] as any}
                                    color={theme.colors.danger}
                                    strokeWidth={1}
                                    // dashArray={[5, 5]}
                                    opacity={0.3}
                                />
                            )}
                            {thresholdHigh !== undefined && (
                                <Line
                                    points={[
                                        { x: chartBounds.left, y: thresholdHigh },
                                        { x: chartBounds.right, y: thresholdHigh }
                                    ] as any}
                                    color={theme.colors.danger}
                                    strokeWidth={1}
                                    // dashArray={[5, 5]}
                                    opacity={0.3}
                                />
                            )}

                            {/* Main Area & Line */}
                            <Area
                                points={points.value}
                                y0={chartBounds.bottom}
                                color={color}
                                opacity={0.15}
                                animate={{ type: 'spring' }}
                            />
                            <Line
                                points={points.value}
                                color={color}
                                strokeWidth={2}
                                animate={{ type: 'spring' }}
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
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 20,
        marginBottom: 16,
    },
    label: {
        marginBottom: 12,
        fontWeight: '700',
        letterSpacing: 1,
    },
    webFallback: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 20,
        marginBottom: 16,
    }
});

export default SensorLineChart;
