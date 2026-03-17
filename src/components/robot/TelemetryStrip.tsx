import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../constants/restyleTheme';
import Text from '../atoms/Text';

interface TelemetryCellProps {
    label: string;
    value: string | number;
    unit: string;
}

function TelemetryCell({ label, value, unit }: TelemetryCellProps) {
    const theme = useTheme<Theme>();
    return (
        <View style={styles.cell}>
            <Text variant="caption" style={styles.cellLabel}>{label}</Text>
            <View style={styles.valueRow}>
                <Text variant="mono" style={styles.cellValue}>
                    {value}
                </Text>
                <Text variant="caption" style={styles.unit}>{unit}</Text>
            </View>
        </View>
    );
}

interface TelemetryStripProps {
    speed: number;
    heading: number;
    power: number;
    latency: number;
}

export function TelemetryStrip({ speed, heading, power, latency }: TelemetryStripProps) {
    const theme = useTheme<Theme>();
    return (
        <View style={[styles.container, { borderBottomColor: theme.colors.border as string }]}>
            <TelemetryCell label="SPEED" value={speed.toFixed(1)} unit="km/h" />
            <TelemetryCell label="HEADING" value={Math.round(heading)} unit="deg" />
            <TelemetryCell label="POWER" value={power} unit="%" />
            <TelemetryCell label="LATENCY" value={latency} unit="ms" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderBottomWidth: 1,
    },
    cell: {
        alignItems: 'center',
    },
    cellLabel: {
        fontSize: 10,
        fontWeight: '700',
        opacity: 0.5,
        marginBottom: 4,
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    cellValue: {
        fontSize: 18,
        fontWeight: '700',
    },
    unit: {
        fontSize: 10,
        marginLeft: 2,
        opacity: 0.6,
    }
});

export default TelemetryStrip;
