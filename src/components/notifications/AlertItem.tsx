import React from 'react';
import { View, StyleSheet, Pressable, Platform, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS,
    FadeInRight,
    FadeOutLeft
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../constants/restyleTheme';
import Text from '../atoms/Text';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = -SCREEN_WIDTH * 0.3;

interface Alert {
    id: string;
    severity: 'critical' | 'warning' | 'info' | 'success';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    robotId?: string;
}

interface AlertItemProps {
    alert: Alert;
    onPress?: (id: string) => void;
    onDismiss?: (id: string) => void;
}

export function AlertItem({ alert, onPress, onDismiss }: AlertItemProps) {
    const theme = useTheme<Theme>();
    const translateX = useSharedValue(0);

    const getIcon = () => {
        switch (alert.severity) {
            case 'critical': return { name: 'alert-decagram', color: theme.colors.danger };
            case 'warning': return { name: 'alert-circle', color: theme.colors.warning };
            case 'success': return { name: 'check-circle', color: theme.colors.success };
            case 'info': default: return { name: 'information-variant', color: theme.colors.primary };
        }
    };

    const { name, color } = getIcon();

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            if (event.translationX < 0) {
                translateX.value = event.translationX;
            }
        })
        .onEnd((event) => {
            if (event.translationX < SWIPE_THRESHOLD) {
                translateX.value = withSpring(-SCREEN_WIDTH);
                if (onDismiss) runOnJS(onDismiss)(alert.id);
            } else {
                translateX.value = withSpring(0);
            }
        });

    const rStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <View style={styles.swipeContainer}>
            {/* Background Action */}
            <View style={[styles.dismissBackground, { backgroundColor: theme.colors.danger + '40' }]}>
                <View style={styles.dismissIconContainer}>
                    <MaterialCommunityIcons name="trash-can-outline" size={24} color={theme.colors.danger as string} />
                    <Text variant="caption" style={{ color: theme.colors.danger as string, fontWeight: '700', marginTop: 4 }}>DISMISS</Text>
                </View>
            </View>

            <GestureDetector gesture={panGesture}>
                <Animated.View
                    entering={FadeInRight.springify()}
                    exiting={FadeOutLeft}
                    style={[
                        styles.container,
                        rStyle,
                        { backgroundColor: theme.colors.surface as string },
                        !alert.read && { borderLeftColor: color as string, borderLeftWidth: 4 }
                    ]}
                >
                    <Pressable
                        onPress={() => onPress?.(alert.id)}
                        style={styles.content}
                        android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: (color as string) + '15' }]}>
                            <MaterialCommunityIcons name={name as any} size={24} color={color as string} />
                        </View>

                        <View style={styles.body}>
                            <View style={styles.header}>
                                <Text variant="body" style={{ fontWeight: '700', flex: 1 }}>{alert.title}</Text>
                                <Text variant="caption" style={{ color: theme.colors.textMuted as string }}>
                                    {formatDistanceToNow(alert.timestamp)}
                                </Text>
                            </View>
                            <Text variant="caption" numberOfLines={2} style={{ marginTop: 2 }}>
                                {alert.message}
                            </Text>
                            {alert.robotId && (
                                <View style={styles.metaRow}>
                                    <MaterialCommunityIcons name="robot" size={12} color={theme.colors.textMuted as string} />
                                    <Text variant="caption" style={{ color: theme.colors.textMuted as string, marginLeft: 4 }}>
                                        ROBOT {alert.robotId}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </Pressable>
                </Animated.View>
            </GestureDetector>
        </View>
    );
}


const styles = StyleSheet.create({
    swipeContainer: {
        marginBottom: 12,
        position: 'relative',
    },
    dismissBackground: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: 24,
    },
    dismissIconContainer: {
        alignItems: 'center',
    },
    container: {
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(15, 23, 42, 0.05)',
        ...Platform.select({
            web: {
                boxShadow: '0px 2px 4px rgba(15, 23, 42, 0.03)',
            },
            default: {
                elevation: 2,
                shadowColor: "#0F172A",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.03,
                shadowRadius: 4,
            }
        }),
    },
    content: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    body: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        opacity: 0.8,
    },
});


export default AlertItem;

