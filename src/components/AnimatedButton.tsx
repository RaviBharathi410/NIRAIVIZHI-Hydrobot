import React, { useRef } from 'react';
import {
    Pressable,
    Animated,
    StyleSheet,
    Text,
    ActivityIndicator,
    View,
    Platform,
    ViewStyle,
    TextStyle,
    StyleProp
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, GRADIENTS, SHADOWS } from '../constants/theme';

interface AnimatedButtonProps {
    title: string;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    variant?: 'primary' | 'accent' | 'danger' | 'warning' | 'outline' | 'ghost' | 'outlined';
    disabled?: boolean;
    loading?: boolean;
    icon?: keyof typeof MaterialCommunityIcons.glyphMap;
    hideIcon?: boolean;
    iconLeft?: keyof typeof MaterialCommunityIcons.glyphMap; // Legacy support
    iconRight?: keyof typeof MaterialCommunityIcons.glyphMap;
    haptic?: boolean;
}

/**
 * Enhanced AnimatedButton with Web Stability
 */
const AnimatedButton: React.FC<AnimatedButtonProps> = ({
    title,
    onPress,
    style,
    textStyle,
    variant = 'primary',
    disabled = false,
    loading = false,
    icon,
    iconLeft,
    iconRight,
    haptic = true
}) => {
    const finalIcon = icon || iconLeft;
    const finalVariant = variant === 'outlined' ? 'outline' : variant;
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        if (disabled || loading) return;
        Animated.spring(scale, {
            toValue: 0.96,
            useNativeDriver: false, // Required for Web compatibility
            tension: 40,
            friction: 3
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: false,
            tension: 40,
            friction: 3
        }).start();
    };

    const handlePress = () => {
        if (disabled || loading) return;
        if (haptic && Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        if (typeof onPress === 'function') {
            onPress();
        }
    };

    const getColors = (): readonly string[] => {
        if (disabled) return [COLORS.border, COLORS.border];
        if (finalVariant === 'primary') return GRADIENTS.primary;
        if (finalVariant === 'accent') return GRADIENTS.accent;
        if (finalVariant === 'danger') return (GRADIENTS as any).danger || GRADIENTS.primary;
        if (finalVariant === 'warning') return (GRADIENTS as any).warning || GRADIENTS.primary;
        return ['transparent', 'transparent'];
    };

    const isOutline = finalVariant === 'outline';
    const textColor = isOutline ? COLORS.primary : COLORS.white;

    return (
        <Pressable
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled || loading}
            style={({ pressed }) => [
                style
            ]}
        >
            <Animated.View
                style={[
                    styles.button,
                    isOutline && { borderWidth: 1.5, borderColor: COLORS.primary },
                    !isOutline && !disabled && SHADOWS.medium as ViewStyle,
                    { transform: [{ scale }] },
                    style,
                ]}
            >
                {!isOutline && finalVariant !== 'ghost' && (
                    <LinearGradient
                        colors={getColors() as any}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={StyleSheet.absoluteFill}
                    />
                )}

                <View style={styles.content}>
                    {loading ? (
                        <ActivityIndicator color={textColor} size="small" />
                    ) : (
                        <>
                            {finalIcon && (
                                <MaterialCommunityIcons
                                    name={finalIcon}
                                    size={20}
                                    color={textColor}
                                    style={styles.leftIcon}
                                />
                            )}
                            <Text style={[
                                styles.text,
                                { color: textColor },
                                textStyle
                            ]}>
                                {title}
                            </Text>
                            {iconRight && (
                                <MaterialCommunityIcons
                                    name={iconRight}
                                    size={20}
                                    color={textColor}
                                    style={styles.rightIcon}
                                />
                            )}
                        </>
                    )}
                </View>
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 54,
        borderRadius: SIZES.radius,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 140,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    text: {
        ...FONTS.semiBold,
        fontSize: 16,
        letterSpacing: 0.5,
    },
    leftIcon: { marginRight: 10 },
    rightIcon: { marginLeft: 10 },
});

export default AnimatedButton;