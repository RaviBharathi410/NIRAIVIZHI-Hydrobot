import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme/restyleTheme';
import Text from './Text';

interface BadgeProps {
    variant?: 'success' | 'warning' | 'danger' | 'info';
    size?: 'small' | 'large';
    showDot?: boolean;
    children: React.ReactNode;
}

export function Badge({ variant = 'info', size = 'small', showDot, children }: BadgeProps) {
    const theme = useTheme<Theme>();

    const getColors = () => {
        switch (variant) {
            case 'success': return { bg: theme.colors.success + '15', text: theme.colors.success };
            case 'warning': return { bg: theme.colors.warning + '15', text: theme.colors.warning };
            case 'danger': return { bg: theme.colors.danger + '15', text: theme.colors.danger };
            case 'info': default: return { bg: 'rgba(59, 130, 246, 0.1)', text: '#3B82F6' };
        }
    };

    const { bg, text } = getColors();

    return (
        <View style={[
            styles.container,
            { backgroundColor: bg },
            size === 'large' ? styles.large : styles.small
        ]}>
            {showDot && (
                <View style={[styles.dot, { backgroundColor: text }]} />
            )}
            <Text
                variant="caption"
                style={{
                    color: text,
                    fontWeight: '700',
                    fontSize: size === 'large' ? 12 : 10,
                    letterSpacing: 0.5
                }}
            >
                {typeof children === 'string' ? children.toUpperCase() : children}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    small: {
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    large: {
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
});

export default Badge;
