import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Polyline, Text as SvgText } from 'react-native-svg';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../constants/restyleTheme';
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
    color = '#00E5FF',
    label
}: SensorLineChartProps) {
    const theme = useTheme<Theme>();

    if (!data || data.length === 0) {
        return <View style={[styles.container, { height: 200, justifyContent: 'center', alignItems: 'center' }]}><Text>No Data Available</Text></View>;
    }

    // Simple line generation for web fallback
    const width = 300;
    const height = 100;
    const maxVal = Math.max(...data.map(d => d.value)) || 1;
    const minVal = Math.min(...data.map(d => d.value)) || 0;
    const range = (maxVal - minVal) || 1;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((d.value - minVal) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <View style={styles.container}>
            {label && <Text variant="caption" style={{ marginBottom: 10 }}>{label.toUpperCase()}</Text>}
            <View style={{ height: 200, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 150 }}>
                    <Polyline
                        points={points}
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                    />
                    <Polyline
                        points={`0,${height} ${points} ${width},${height}`}
                        fill={color}
                        opacity="0.1"
                    />
                </Svg>
                <View style={styles.overlay}>
                    <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={24} color={color + '40'} />
                    <Text variant="caption" style={{ marginTop: 4, opacity: 0.6 }}>Web Analytics Active</Text>
                </View>
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
    overlay: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
    }
});

export default SensorLineChart;
