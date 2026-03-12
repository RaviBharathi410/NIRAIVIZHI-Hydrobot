import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    FadeInDown,
    FadeOutDown
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '../../theme/restyleTheme';
import Button from '../atoms/Button';
import Text from '../atoms/Text';

const ACTIONS = [
    { icon: 'play', label: 'Start Mission', color: 'primary', route: 'FleetManagement' },
    { icon: 'alert-octagon', label: 'Emergency Alerts', color: 'danger', route: 'Alerts' },
    { icon: 'cog-outline', label: 'Settings', color: 'primary', route: 'HydrobotSettings' },
];

export function FABMenu() {
    const theme = useTheme<Theme>();
    const navigation = useNavigation<any>();
    const [open, setOpen] = useState(false);
    const rotation = useSharedValue(0);

    const toggle = () => {
        setOpen(prev => !prev);
        rotation.value = withSpring(open ? 0 : 45);
    };

    const rotationStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    return (
        <View style={styles.container}>
            {open && (
                <View style={styles.backdrop}>
                    {ACTIONS.map((action, i) => (
                        <Animated.View
                            key={action.label}
                            entering={FadeInDown.delay(i * 50).springify()}
                            exiting={FadeOutDown.delay((ACTIONS.length - i) * 30)}
                            style={[styles.actionItem, { bottom: (i + 1) * 72 }]}
                        >
                            <View style={styles.labelContainer}>
                                <Text variant="caption" style={styles.label}>{action.label}</Text>
                            </View>
                            <Button
                                onPress={() => navigation.navigate(action.route)}
                                variant="fab"
                                style={{ backgroundColor: action.color === 'danger' ? theme.colors.danger : theme.colors.primary }}
                            >
                                <MaterialCommunityIcons name={action.icon as any} size={24} color="white" />
                            </Button>
                        </Animated.View>
                    ))}
                </View>
            )}

            <TouchableOpacity activeOpacity={0.9} onPress={toggle}>
                <Animated.View style={[
                    styles.mainFab,
                    { backgroundColor: theme.colors.primary },
                    rotationStyle
                ]}>
                    <MaterialCommunityIcons name="plus" size={32} color="white" />
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 30,
        right: 24,
        alignItems: 'center',
    },
    mainFab: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        ...Platform.select({
            web: { boxShadow: '0px 4px 16px rgba(0,0,0,0.3)' } as any,
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
        }),
    },
    backdrop: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 200,
        height: 300,
        alignItems: 'flex-end',
    },
    actionItem: {
        position: 'absolute',
        right: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    labelContainer: {
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginRight: 12,
    },
    label: {
        color: 'white',
        fontWeight: '700',
    }
});

export default FABMenu;
