import React from 'react';
import { Pressable, StyleSheet, ActivityIndicator, ViewStyle, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme/restyleTheme';
import Text from './Text';

interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon' | 'fab';
    onPress?: () => void;
    children?: React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
    leftIcon?: React.ReactNode;
    fullWidth?: boolean;
    style?: ViewStyle;
}

export function Button({
    variant = 'primary',
    onPress,
    children,
    disabled,
    loading,
    leftIcon,
    fullWidth,
    style
}: ButtonProps) {
    const theme = useTheme<Theme>();
    const scale = useSharedValue(1);

    const animStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    function handlePressIn() {
        if (disabled || loading) return;
        scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    function handlePressOut() {
        scale.value = withSpring(1.0, { damping: 12, stiffness: 200 });
    }

    // Hand-rolled variant styles mapping theme colors
    const getVariantStyle = () => {
        const base: ViewStyle = {
            height: 48,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 20,
        };

        switch (variant) {
            case 'primary':
                return { ...base, backgroundColor: theme.colors.primary };
            case 'secondary':
                return { ...base, backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.colors.primary };
            case 'ghost':
                return { ...base, backgroundColor: 'transparent' };
            case 'danger':
                return { ...base, backgroundColor: theme.colors.danger };
            case 'icon':
                return { width: 48, height: 48, borderRadius: 24, justifyContent: 'center' as const, alignItems: 'center' as const, backgroundColor: theme.colors.primaryLight };
            case 'fab':
                return {
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    justifyContent: 'center' as const,
                    alignItems: 'center' as const,
                    backgroundColor: theme.colors.primary,
                    ...Platform.select({
                        web: {
                            boxShadow: '0px 2px 3.84px rgba(0,0,0,0.25)',
                        },
                        default: {
                            elevation: 5,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84
                        }
                    })
                };
            default:
                return base;
        }
    };

    const getTextColor = () => {
        if (variant === 'secondary' || variant === 'ghost') return 'primary';
        if (variant === 'icon') return 'primary';
        return 'white';
    };

    return (
        <Animated.View style={[animStyle, fullWidth && { width: '100%' }]}>
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={onPress}
                disabled={disabled || loading}
                style={[getVariantStyle(), disabled && { opacity: 0.4 }, style]}
            >
                {loading ? (
                    <ActivityIndicator color={variant === 'secondary' || variant === 'ghost' ? theme.colors.primary : '#FFF'} />
                ) : (
                    <>
                        {leftIcon}
                        {typeof children === 'string' ? (
                            <Text variant="body" color={getTextColor() as any} style={{ fontWeight: '600' }}>
                                {children}
                            </Text>
                        ) : (
                            children
                        )}
                    </>
                )}
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        fontWeight: '600',
    }
});

export default Button;
