import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS,
    interpolate
} from 'react-native-reanimated';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme/restyleTheme';
import Text from '../atoms/Text';

interface SpeedSliderProps {
    value?: number;
    onValueChange: (value: number) => void;
    height?: number;
}

export function SpeedSlider({ value = 0, onValueChange, height = 240 }: SpeedSliderProps) {
    const theme = useTheme<Theme>();
    const translateY = useSharedValue(0);
    const MAX_UP = -height / 2 + 30;
    const MAX_DOWN = height / 2 - 30;

    // Sync external value to internal animation state
    React.useEffect(() => {
        const targetY = interpolate(
            value,
            [0, 100],
            [MAX_DOWN, MAX_UP]
        );
        translateY.value = withSpring(targetY);
    }, [value, MAX_UP, MAX_DOWN]);

    const gesture = Gesture.Pan()
        .onUpdate((e) => {
            const nextY = e.translationY;
            translateY.value = Math.min(MAX_DOWN, Math.max(MAX_UP, nextY));

            // Map to percentage (0 to 100) where top is 100
            const percent = interpolate(
                translateY.value,
                [MAX_DOWN, MAX_UP],
                [0, 100]
            );
            runOnJS(onValueChange)(parseFloat(percent.toFixed(0)));
        })
        .onEnd(() => {
            // Option to snap back or stay. For throttle, we might want it to stay.
            // But for safety, snapping back to neutral (middle or bottom) is often better.
            // Documentation doesn't specify, I'll let it stay for "throttle" feel.
        });

    const handleStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }]
    }));

    const progressStyle = useAnimatedStyle(() => ({
        height: interpolate(translateY.value, [MAX_DOWN, MAX_UP], [0, height]),
        top: 0, // This is tricky for vertical, better use absolute positioning
    }));

    return (
        <View style={[styles.container, { height }]}>
            <View style={styles.track}>
                {/* Background markers */}
                <View style={styles.markers}>
                    {[100, 75, 50, 25, 0].map(m => (
                        <View key={m} style={styles.marker}>
                            <View style={styles.markerLine} />
                            <Text variant="caption" style={{ fontSize: 9 }}>{m}%</Text>
                        </View>
                    ))}
                </View>

                <GestureDetector gesture={gesture}>
                    <Animated.View style={[styles.handle, handleStyle]}>
                        <View style={styles.handleInner} />
                    </Animated.View>
                </GestureDetector>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    track: {
        width: 20,
        height: '100%',
        backgroundColor: 'rgba(15, 23, 42, 0.05)',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    handle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF',
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(15, 23, 42, 0.08)',
    },
    handleInner: {
        width: 24,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#6366F1',
    },
    markers: {
        position: 'absolute',
        right: -30,
        height: '100%',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    marker: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    markerLine: {
        width: 6,
        height: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.1)',
        marginRight: 4,
    },
});

export default SpeedSlider;
