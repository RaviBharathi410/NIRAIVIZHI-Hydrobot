import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme/restyleTheme';

interface JoystickProps {
    onCommand: (command: { x: number; y: number }) => void;
    size?: number;
    thumbSize?: number;
}

const MAX_RADIUS = 80;
const DEAD_ZONE = 15;

export function Joystick({ onCommand, size = 200, thumbSize = 60 }: JoystickProps) {
    const theme = useTheme<Theme>();
    const thumbX = useSharedValue(0);
    const thumbY = useSharedValue(0);

    const emitCommand = (x: number, y: number) => {
        const dist = Math.sqrt(x * x + y * y);
        if (dist < DEAD_ZONE) {
            onCommand({ x: 0, y: 0 });
            return;
        }
        // Normalize to -1 to 1
        onCommand({
            x: parseFloat((x / MAX_RADIUS).toFixed(2)),
            y: parseFloat((y / MAX_RADIUS).toFixed(2)),
        });
    };

    const gesture = Gesture.Pan()
        .onUpdate((e) => {
            const dist = Math.sqrt(e.translationX ** 2 + e.translationY ** 2);
            const clamped = Math.min(dist, MAX_RADIUS);
            const angle = Math.atan2(e.translationY, e.translationX);

            thumbX.value = clamped * Math.cos(angle);
            thumbY.value = clamped * Math.sin(angle);

            runOnJS(emitCommand)(thumbX.value, thumbY.value);
            runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
        })
        .onEnd(() => {
            thumbX.value = withSpring(0, { damping: 15 });
            thumbY.value = withSpring(0, { damping: 15 });
            runOnJS(onCommand)({ x: 0, y: 0 });
        });

    const thumbStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: thumbX.value }, { translateY: thumbY.value }] as any
    }));

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <View style={[styles.outerRing, { width: size, height: size, borderRadius: size / 2 }]}>
                {/* Visual guidelines */}
                <View style={[styles.guideV, { height: size }]} />
                <View style={[styles.guideH, { width: size }]} />

                <GestureDetector gesture={gesture}>
                    <Animated.View style={[
                        styles.thumb,
                        { width: thumbSize, height: thumbSize, borderRadius: thumbSize / 2 },
                        thumbStyle
                    ]} />
                </GestureDetector>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    outerRing: {
        backgroundColor: 'rgba(15, 23, 42, 0.05)',
        borderWidth: 2,
        borderColor: 'rgba(15, 23, 42, 0.08)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    thumb: {
        backgroundColor: '#6366F1', // Indigo 500
        elevation: 8,
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        zIndex: 10,
    },
    guideV: {
        position: 'absolute',
        width: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.03)',
    },
    guideH: {
        position: 'absolute',
        height: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.03)',
    },
});

export default Joystick;
