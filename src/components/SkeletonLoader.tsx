import React, { useEffect } from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, interpolate } from 'react-native-reanimated';
import { SIZES } from '../constants/theme';

interface SkeletonLoaderProps {
    width?: number | string;
    height?: number | string;
    borderRadius?: number;
    style?: StyleProp<ViewStyle>;
}

export default function SkeletonLoader({
    width = '100%',
    height = 20,
    borderRadius = SIZES.radiusSm,
    style
}: SkeletonLoaderProps) {
    const x = useSharedValue(-1);

    useEffect(() => {
        x.value = withRepeat(
            withTiming(1, { duration: 1500 }),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        const w = typeof width === 'number' ? width : 300;
        return {
            transform: [{ translateX: interpolate(x.value, [-1, 1], [-w, w]) }],
        };
    });

    return (
        <View style={[styles.container, { width, height, borderRadius }, style] as any}>
            <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
                <LinearGradient
                    colors={['transparent', 'rgba(255, 255, 255, 0.05)', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        overflow: 'hidden',
    },
});
