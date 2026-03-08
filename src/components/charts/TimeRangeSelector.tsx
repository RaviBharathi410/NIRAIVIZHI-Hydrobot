import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme/restyleTheme';
import Text from '../atoms/Text';

const RANGES = ['1H', '6H', '24H', '7D'] as const;
type Range = typeof RANGES[number];

interface TimeRangeSelectorProps {
    selected: Range;
    onChange: (range: Range) => void;
}

export function TimeRangeSelector({ selected, onChange }: TimeRangeSelectorProps) {
    const theme = useTheme<Theme>();

    return (
        <View style={styles.row}>
            {RANGES.map(range => (
                <Pressable
                    key={range}
                    onPress={() => onChange(range)}
                    style={[
                        styles.btn,
                        { backgroundColor: selected === range ? theme.colors.primary : 'transparent' }
                    ]}
                >
                    <Text
                        variant="caption"
                        style={{
                            color: selected === range ? '#FFF' : theme.colors.textSecondary,
                            fontWeight: '700'
                        }}
                    >
                        {range}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        backgroundColor: 'rgba(15, 23, 42, 0.05)',
        borderRadius: 12,
        padding: 4,
        alignSelf: 'center',
        marginBottom: 20,
    },
    btn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
});

export default TimeRangeSelector;
