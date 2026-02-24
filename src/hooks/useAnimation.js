import { useEffect } from 'react';
import { useSharedValue, useAnimatedStyle, withTiming, withSpring, withRepeat, Easing, withDelay } from 'react-native-reanimated';
import { SPRING } from '../constants/theme';

export function useFadeInUp(delay = 0, duration = 600) {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(20);

    useEffect(() => {
        opacity.value = withDelay(delay, withTiming(1, { duration }));
        translateY.value = withDelay(delay, withSpring(0, SPRING.gentle));
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    return animatedStyle;
}

export function useScaleEntrance(delay = 0) {
    const scale = useSharedValue(0.8);
    const opacity = useSharedValue(0);

    useEffect(() => {
        scale.value = withDelay(delay, withSpring(1, SPRING.bouncy));
        opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
    }));

    return animatedStyle;
}

export function usePulse(duration = 2000) {
    const scale = useSharedValue(1);

    useEffect(() => {
        scale.value = withRepeat(
            withTiming(1.05, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return animatedStyle;
}

export function useStagger(index, baseDelay = 100) {
    return useFadeInUp(index * baseDelay);
}

export default { useFadeInUp, useScaleEntrance, usePulse, useStagger };
