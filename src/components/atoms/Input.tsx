import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TextInputProps, Platform } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme/restyleTheme';
import Text from './Text';

interface InputProps extends TextInputProps {
    type?: 'text' | 'numeric' | 'search';
    label?: string;
    error?: string;
}

export function Input({ type = 'text', label, error, value, onChangeText, ...props }: InputProps) {
    const theme = useTheme<Theme>();
    const [focused, setFocused] = useState(false);

    const borderColor = error
        ? theme.colors.danger
        : focused
            ? theme.colors.primary
            : theme.colors.border;

    return (
        <View style={styles.container}>
            {label && (
                <Text variant="caption" style={{ marginBottom: 6, fontWeight: '600' }}>
                    {label}
                </Text>
            )}
            <View style={[
                styles.inputWrapper,
                { borderColor },
                focused && SHADOWS.small // Optional focus glow if SHADOWS imported or replicated
            ]}>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    keyboardType={type === 'numeric' ? 'numeric' : 'default'}
                    placeholderTextColor={theme.colors.textMuted}
                    cursorColor={theme.colors.primary}
                    style={styles.input}
                    {...props}
                />
            </View>
            {error && (
                <Text variant="caption" color="danger" style={{ marginTop: 4 }}>
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
    inputWrapper: {
        height: 52,
        borderWidth: 1,
        borderRadius: 12,
        backgroundColor: 'rgba(15, 23, 42, 0.02)',
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    input: {
        fontSize: 16,
        color: '#0F172A', // Slate 900
        padding: 0,
    },
});

// Mock SHADOWS if needed or import
const SHADOWS = {
    small: Platform.select({
        web: {
            boxShadow: '0px 2px 5px rgba(15, 23, 42, 0.04)',
        },
        default: {
            shadowColor: "#0F172A",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 5,
            elevation: 2,
        }
    })
};

export default Input;
