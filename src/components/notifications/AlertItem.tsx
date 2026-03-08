import React from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme/restyleTheme';
import Text from '../atoms/Text';
import Badge from '../atoms/Badge';

interface Alert {
    id: string;
    type: 'critical' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: Date;
    isRead: boolean;
}

interface AlertItemProps {
    alert: Alert;
    onPress: (id: string) => void;
    onDismiss: (id: string) => void;
}

export function AlertItem({ alert, onPress, onDismiss }: AlertItemProps) {
    const theme = useTheme<Theme>();

    const getIcon = () => {
        switch (alert.type) {
            case 'critical': return { name: 'alert-decagram', color: theme.colors.danger };
            case 'warning': return { name: 'alert-circle', color: theme.colors.warning };
            case 'info': default: return { name: 'information-variant', color: theme.colors.primary };
        }
    };

    const { name, color } = getIcon();

    return (
        <Animated.View
            entering={FadeInRight.springify()}
            exiting={FadeOutLeft}
            style={[
                styles.container,
                { backgroundColor: theme.colors.surface },
                !alert.isRead && { borderLeftColor: color, borderLeftWidth: 4 }
            ]}
        >
            <Pressable onPress={() => onPress(alert.id)} style={styles.content}>
                <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
                    <MaterialCommunityIcons name={name as any} size={24} color={color} />
                </View>

                <View style={styles.body}>
                    <View style={styles.header}>
                        <Text variant="body" style={{ fontWeight: '700', flex: 1 }}>{alert.title}</Text>
                        <Text variant="caption" color="textMuted">
                            {formatDistanceToNow(alert.timestamp)}
                        </Text>
                    </View>
                    <Text variant="caption" numberOfLines={2} style={{ marginTop: 2 }}>
                        {alert.message}
                    </Text>
                </View>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
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
});

export default AlertItem;
