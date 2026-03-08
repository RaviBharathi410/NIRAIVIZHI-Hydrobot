import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';

interface SkeletonProps {
    width: number | string;
    height: number;
    borderRadius?: number;
}

export function Skeleton({ width, height, borderRadius = 8 }: SkeletonProps) {
    const opacity = useSharedValue(0.4);

    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(0.8, { duration: 800 }),
            -1,   // repeat forever
            true  // reverse each cycle
        );
    }, []);

    const style = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[
            {
                width,
                height,
                borderRadius,
                backgroundColor: 'rgba(15, 23, 42, 0.08)'
            } as any,
            style
        ]} />
    );
}

export default Skeleton;
