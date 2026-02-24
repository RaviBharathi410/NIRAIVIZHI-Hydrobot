import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACE } from '../constants/theme';
import { MotiView } from 'moti';

export default function SectionHeader({
    title,
    onPress,
    actionLabel = 'See All',
    style
}) {
    return (
        <View style={[styles.container, style]}>
            <View>
                <Text style={styles.title}>{title}</Text>
                <MotiView
                    from={{ width: 0 }}
                    animate={{ width: 40 }}
                    transition={{ duration: 1000, type: 'timing' }}
                    style={styles.underline}
                />
            </View>
            {onPress && (
                <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                    <Text style={styles.action}>{actionLabel}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACE[3],
        marginTop: SPACE[4],
    },
    title: {
        ...FONTS.bold,
        fontSize: 18,
        color: COLORS.text,
        letterSpacing: 0.5,
    },
    underline: {
        height: 3,
        backgroundColor: COLORS.accent,
        borderRadius: 2,
        marginTop: 4,
    },
    action: {
        ...FONTS.medium,
        fontSize: 14,
        color: COLORS.accent,
    },
});
