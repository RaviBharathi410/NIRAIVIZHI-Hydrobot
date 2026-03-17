import React, { useRef, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring
} from 'react-native-reanimated';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../constants/restyleTheme';
import Text from '../atoms/Text';

interface EmergencyStopButtonProps {
    onTrigger: () => void;
    size?: number;
}

export function EmergencyStopButton({ onTrigger, size = 100 }: EmergencyStopButtonProps) {
    const theme = useTheme<Theme>();
    const progress = useSharedValue(0);
    const holdTimer = useRef<NodeJS.Timeout | null>(null);
    const [active, setActive] = useState(false);

    const cx = size / 2;
    const cy = size / 2;
    const r = (size / 2) - 5;

    const onPressIn = () => {
        setActive(true);
        progress.value = withTiming(1, { duration: 2000 });
        holdTimer.current = setTimeout(() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            onTrigger();
            setActive(false);
            progress.value = 0;
        }, 2000);
    };

    const onPressOut = () => {
        if (holdTimer.current) {
            clearTimeout(holdTimer.current);
            holdTimer.current = null;
        }
        setActive(false);
        progress.value = withSpring(0);
    };

    const progressPath = useSharedValue(Skia.Path.Make());

    React.useEffect(() => {
        // We use a listener for the progress to update the Skia path
        const interval = setInterval(() => {
            const p = progress.value;
            const path = Skia.Path.Make();
            if (p > 0) {
                path.addArc({ x: 5, y: 5, width: size - 10, height: size - 10 }, -90, p * 360);
            }
            progressPath.value = path;
        }, 32); // ~30fps update for the arc
        return () => clearInterval(interval);
    }, [size]);

    return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            <Canvas style={{ position: 'absolute', width: size, height: size }}>
                <Path
                    path={Skia.Path.Make().addArc({ x: 5, y: 5, width: size - 10, height: size - 10 }, 0, 360)}
                    color={theme.colors.danger as string}
                    style="stroke"
                    strokeWidth={4}
                    opacity={0.1}
                />
                <Path
                    path={progressPath.value}
                    color={theme.colors.danger as string}
                    style="stroke"
                    strokeWidth={4}
                    strokeCap="round"
                />
            </Canvas>

            <Pressable
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                style={[
                    styles.button,
                    {
                        width: size - 20,
                        height: size - 20,
                        borderRadius: (size - 20) / 2,
                        backgroundColor: active ? theme.colors.danger : 'rgba(239, 68, 68, 0.1)'
                    }
                ]}
            >
                <Text
                    variant="caption"
                    style={[
                        styles.label,
                        { color: active ? 'white' : theme.colors.danger }
                    ]}
                >
                    STOP
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    label: {
        fontWeight: '900',
        fontSize: 14,
        letterSpacing: 1,
    }
});

export default EmergencyStopButton;
