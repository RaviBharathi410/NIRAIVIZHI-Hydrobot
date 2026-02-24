import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, interpolate } from 'react-native-reanimated';
import { COLORS, SIZES } from '../constants/theme';

export default function SkeletonLoader({
    width = '100%',
    height = 20,
    borderRadius = SIZES.radiusSm,
    style
}) {
    const x = useSharedValue(-1);

    useEffect(() => {
        x.value = withRepeat(
            withTiming(1, { duration: 1500 }),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: interpolate(x.value, [-1, 1], [-width, width]) }],
        };
    });

    return (
        <View style={[styles.container, { width, height, borderRadius }, style]}>
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
