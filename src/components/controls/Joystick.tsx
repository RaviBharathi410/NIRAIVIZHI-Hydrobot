import React from 'react';
import { View, StyleSheet } from 'react-native';
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
    snapMode?: boolean;
}

const OUTER_SIZE = 240;
const THUMB_SIZE = 60;
const MAX_RADIUS = 100;
const DEAD_ZONE = 20;

export function Joystick({ onCommand, snapMode = false }: JoystickProps) {
    const theme = useTheme<Theme>();
    const thumbX = useSharedValue(0);
    const thumbY = useSharedValue(0);

    const emitCommand = (x: number, y: number) => {
        const dist = Math.sqrt(x * x + y * y);
        if (dist < DEAD_ZONE) {
            onCommand({ x: 0, y: 0 });
            return;
        }

        let finalX = x / MAX_RADIUS;
        let finalY = y / MAX_RADIUS;

        if (snapMode) {
            const angle = Math.atan2(y, x);
            const snappedAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
            const radius = Math.min(dist, MAX_RADIUS) / MAX_RADIUS;
            finalX = radius * Math.cos(snappedAngle);
            finalY = radius * Math.sin(snappedAngle);
        }

        onCommand({
            x: parseFloat(finalX.toFixed(2)),
            y: parseFloat(finalY.toFixed(2)),
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
        <View style={styles.container}>
            <View style={styles.outerRing}>
                <View style={[styles.guideV, { height: OUTER_SIZE }]} />
                <View style={[styles.guideH, { width: OUTER_SIZE }]} />

                <GestureDetector gesture={gesture}>
                    <Animated.View style={[styles.thumb, thumbStyle]} />
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
        width: OUTER_SIZE,
        height: OUTER_SIZE,
        borderRadius: OUTER_SIZE / 2,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    thumb: {
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        borderRadius: THUMB_SIZE / 2,
        backgroundColor: '#00E5FF', // Cyan brand color
        elevation: 10,
        shadowColor: "#00E5FF",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        borderWidth: 2,
        borderColor: 'white',
    },
    guideV: {
        position: 'absolute',
        width: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    guideH: {
        position: 'absolute',
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
});

export default Joystick;
