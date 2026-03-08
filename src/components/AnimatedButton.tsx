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
    variant?: 'primary' | 'accent' | 'danger' | 'warning' | 'outline' | 'ghost';
    disabled?: boolean;
    loading?: boolean;
    icon?: keyof typeof MaterialCommunityIcons.glyphMap;
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
    iconRight,
    haptic = true
}) => {
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
        if (variant === 'primary') return GRADIENTS.primary;
        if (variant === 'accent') return GRADIENTS.accent;
        if (variant === 'danger') return GRADIENTS.danger;
        if (variant === 'warning') return GRADIENTS.warning;
        return ['transparent', 'transparent'];
    };

    const isOutline = variant === 'outline';
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
                {!isOutline && variant !== 'ghost' && (
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
                            {icon && (
                                <MaterialCommunityIcons
                                    name={icon}
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