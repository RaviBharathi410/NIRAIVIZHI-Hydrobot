import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
    useSharedValue,
    withTiming,
    runOnJS,
    useAnimatedProps,
} from 'react-native-reanimated';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../constants/restyleTheme';
import Text from '../atoms/Text';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface EmergencyStopButtonProps {
    onTrigger: () => void;
    size?: number;
}

export function EmergencyStopButton({ onTrigger, size = 100 }: EmergencyStopButtonProps) {
    const theme = useTheme<Theme>();
    const progress = useSharedValue(0);
    const [isActive, setIsActive] = useState(false);

    const handlePressIn = () => {
        setIsActive(true);
        progress.value = withTiming(1, { duration: 2000 }, (finished) => {
            if (finished) {
                runOnJS(onTrigger)();
                progress.value = 0;
            }
        });
    };

    const handlePressOut = () => {
        setIsActive(false);
        if (progress.value < 1) {
            progress.value = withTiming(0, { duration: 300 });
        }
    };

    const animatedProps = useAnimatedProps(() => {
        const radius = (size / 2) - 5;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (progress.value * circumference);
        return {
            strokeDashoffset,
        };
    });

    const radius = (size / 2) - 5;
    const circumference = 2 * Math.PI * radius;

    return (
        <View style={{ alignItems: 'center' }}>
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[
                    styles.button,
                    { width: size, height: size, borderRadius: size / 2 },
                    isActive && { backgroundColor: theme.colors.danger + '20' }
                ]}
            >
                <Svg style={styles.canvas} width={size} height={size}>
                    <AnimatedPath
                        d={`M ${size / 2} 5 A ${radius} ${radius} 0 1 1 ${size / 2 - 0.01} 5`}
                        stroke={theme.colors.danger}
                        strokeWidth={4}
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${circumference} ${circumference}`}
                        animatedProps={animatedProps}
                    />
                </Svg>
                <View style={[styles.inner, { backgroundColor: theme.colors.danger }]}>
                    <Text variant="body" style={{ color: '#FFF', fontWeight: '900', fontSize: 12 }}>STOP</Text>
                </View>
            </Pressable>
            <Text variant="caption" style={{ marginTop: 8, color: theme.colors.danger, fontWeight: '700' }}>HOLD 2S</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(239, 68, 68, 0.1)',
    },
    canvas: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        transform: [{ rotate: '-90deg' }],
    },
    inner: {
        width: '70%',
        height: '70%',
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: "#EF4444",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
});

export default EmergencyStopButton;
