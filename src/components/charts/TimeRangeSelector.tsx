import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../constants/restyleTheme';
import Text from '../atoms/Text';

const RANGES = ['1H', '6H', '24H', '7D'] as const;
export type TimeRange = typeof RANGES[number];

interface TimeRangeSelectorProps {
    selected: TimeRange;
    onChange: (range: TimeRange) => void;
}

export function TimeRangeSelector({ selected, onChange }: TimeRangeSelectorProps) {
    const theme = useTheme<Theme>();

    return (
        <View style={styles.container}>
            {RANGES.map(range => (
                <Pressable
                    key={range}
                    onPress={() => onChange(range)}
                    style={[
                        styles.btn,
                        selected === range && { backgroundColor: theme.colors.primary }
                    ]}
                >
                    <Text
                        variant="caption"
                        style={[
                            styles.text,
                            selected === range
                                ? { color: theme.colors.white, fontWeight: '700' }
                                : { color: theme.colors.textMuted }
                        ]}
                    >
                        {range}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 4,
        alignSelf: 'center',
        marginBottom: 16,
    },
    btn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        minWidth: 60,
        alignItems: 'center',
    },
    text: {
        fontSize: 12,
    }
});

export default TimeRangeSelector;
