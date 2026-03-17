import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ViewStyle, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../constants/restyleTheme';
import Text from './Text';

interface InputProps {
    type?: 'text' | 'numeric' | 'search';
    label?: string;
    error?: string;
    success?: boolean;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    style?: ViewStyle;
}

export function Input({
    type = 'text',
    label,
    error,
    success,
    value,
    onChangeText,
    placeholder,
    style
}: InputProps) {
    const theme = useTheme<Theme>();
    const [focused, setFocused] = useState(false);

    const getBorderColor = () => {
        if (error) return theme.colors.danger;
        if (success) return theme.colors.success;
        if (focused) return theme.colors.primary;
        return theme.colors.border;
    };

    return (
        <View style={[styles.container, style]}>
            {label && (
                <Text variant="caption" style={styles.label}>
                    {label}
                </Text>
            )}
            <View style={[
                styles.inputWrapper,
                { borderColor: getBorderColor() as string },
                focused && styles.focusedShadow
            ]}>
                {type === 'search' && (
                    <MaterialCommunityIcons
                        name="magnify"
                        size={20}
                        color={theme.colors.textMuted}
                        style={styles.icon}
                    />
                )}
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.textMuted}
                    keyboardType={type === 'numeric' ? 'numeric' : 'default'}
                    style={[
                        styles.input,
                        { color: theme.colors.text as string }
                    ]}
                />
                {type === 'search' && value.length > 0 && (
                    <MaterialCommunityIcons
                        name="close-circle"
                        size={18}
                        color={theme.colors.textMuted}
                        onPress={() => onChangeText('')}
                    />
                )}
            </View>
            {error && (
                <Text variant="caption" style={[styles.error, { color: theme.colors.danger }]}>
                    {error}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        width: '100%',
    },
    label: {
        marginBottom: 6,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    inputWrapper: {
        height: 50,
        borderWidth: 1.5,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        paddingLeft: 8,
    },
    icon: {
        marginRight: 4,
    },
    error: {
        marginTop: 4,
        fontWeight: '500',
    },
    focusedShadow: {
        ...Platform.select({
            web: { boxShadow: '0px 0px 8px rgba(99, 102, 241, 0.15)' } as any,
            ios: {
                shadowColor: '#6366F1',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
        }),
    }
});

export default Input;
