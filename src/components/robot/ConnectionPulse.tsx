import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    cancelAnimation
} from 'react-native-reanimated';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme/restyleTheme';

interface ConnectionPulseProps {
    connected: boolean;
}

export function ConnectionPulse({ connected }: ConnectionPulseProps) {
    const theme = useTheme<Theme>();
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    useEffect(() => {
        if (connected) {
            scale.value = withRepeat(withSequence(
                withTiming(1.6, { duration: 700 }),
                withTiming(1.0, { duration: 700 })
            ), -1);
            opacity.value = withRepeat(withSequence(
                withTiming(0.3, { duration: 700 }),
                withTiming(1.0, { duration: 700 })
            ), -1);
        } else {
            cancelAnimation(scale);
            cancelAnimation(opacity);
            scale.value = 1;
            opacity.value = 1;
        }
    }, [connected]);

    const dotStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[
            styles.dot,
            { backgroundColor: connected ? theme.colors.success : theme.colors.danger },
            dotStyle
        ]} />
    );
}

const styles = StyleSheet.create({
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
});

export default ConnectionPulse;
