import React from 'react';
import { Pressable, StyleSheet, ActivityIndicator, ViewStyle, StyleProp, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme/restyleTheme';
import Text from './Text';

interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon' | 'fab';
    onPress?: () => void;
    children?: React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
    leftIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
    rightIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
    fullWidth?: boolean;
    style?: StyleProp<ViewStyle>;
}

export function Button({
    variant = 'primary',
    onPress,
    children,
    disabled = false,
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    style
}: ButtonProps) {
    const theme = useTheme<Theme>();
    const scale = useSharedValue(1);

    const animStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        if (disabled || loading) return;
        scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1.0, { damping: 12, stiffness: 200 });
    };

    const getVariantStyles = () => {
        switch (variant) {
            case 'primary':
                return {
                    container: { backgroundColor: theme.colors.primary },
                    text: theme.colors.white,
                };
            case 'secondary':
                return {
                    container: {
                        backgroundColor: 'transparent',
                        borderWidth: 1.5,
                        borderColor: theme.colors.primary
                    },
                    text: theme.colors.primary,
                };
            case 'ghost':
                return {
                    container: { backgroundColor: 'transparent' },
                    text: theme.colors.primary,
                };
            case 'danger':
                return {
                    container: { backgroundColor: theme.colors.danger },
                    text: theme.colors.white,
                };
            case 'icon':
                return {
                    container: {
                        backgroundColor: theme.colors.surface,
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        paddingHorizontal: 0
                    },
                    text: theme.colors.text,
                };
            case 'fab':
                return {
                    container: {
                        backgroundColor: theme.colors.primary,
                        width: 56,
                        height: 56,
                        borderRadius: 28,
                        elevation: 5,
                        ...Platform.select({
                            web: { boxShadow: '0px 4px 8px rgba(0,0,0,0.3)' } as any,
                            ios: {
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 4,
                            },
                        }),
                        paddingHorizontal: 0
                    },
                    text: theme.colors.white,
                };
            default:
                return {
                    container: { backgroundColor: theme.colors.primary },
                    text: theme.colors.white,
                };
        }
    };

    const vStyles = getVariantStyles();

    return (
        <Animated.View style={[
            fullWidth && { width: '100%' },
            animStyle,
            style
        ]}>
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={onPress}
                disabled={disabled || loading}
                style={[
                    styles.base,
                    vStyles.container as ViewStyle,
                    disabled && { opacity: 0.4 },
                ]}
            >
                {loading ? (
                    <ActivityIndicator color={vStyles.text as string} size="small" />
                ) : (
                    <>
                        {leftIcon && (
                            <MaterialCommunityIcons
                                name={leftIcon}
                                size={variant === 'fab' ? 28 : 20}
                                color={vStyles.text as string}
                                style={children ? { marginRight: 8 } : {}}
                            />
                        )}
                        {typeof children === 'string' ? (
                            <Text
                                variant="body"
                                style={{
                                    color: vStyles.text as string,
                                    fontWeight: '600'
                                }}
                            >
                                {children}
                            </Text>
                        ) : children}
                        {rightIcon && (
                            <MaterialCommunityIcons
                                name={rightIcon}
                                size={20}
                                color={vStyles.text as string}
                                style={{ marginLeft: 8 }}
                            />
                        )}
                    </>
                )}
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    base: {
        height: 50,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
});

export default Button;
