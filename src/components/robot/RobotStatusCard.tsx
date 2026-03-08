import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme/restyleTheme';
import Text from '../atoms/Text';
import Skeleton from '../atoms/Skeleton';
import BatteryGauge from './BatteryGauge';
import ConnectionPulse from './ConnectionPulse';

interface Robot {
    id: string;
    name: string;
    isOnline: boolean;
    battery: number;
    missionStatus: string;
    lastSeen: Date;
}

interface RobotStatusCardProps {
    robot: Robot;
    index: number;
    isLoading?: boolean;
}

export function RobotStatusCard({ robot, index, isLoading }: RobotStatusCardProps) {
    const theme = useTheme<Theme>();

    if (isLoading) {
        return (
            <View style={styles.card}>
                <Skeleton width="60%" height={20} />
                <View style={{ height: 16 }} />
                <Skeleton width="100%" height={60} />
                <View style={{ height: 12 }} />
                <Skeleton width="40%" height={14} />
            </View>
        );
    }

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 60).springify()}
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
        >
            <View style={styles.row}>
                <Text variant="subheading" style={{ fontSize: 18 }}>{robot.name}</Text>
                <ConnectionPulse connected={robot.isOnline} />
            </View>

            <View style={[styles.row, { marginVertical: 16 }]}>
                <BatteryGauge percent={robot.battery} size={80} />
                <View style={{ flex: 1, marginLeft: 20 }}>
                    <Text variant="caption">Mission</Text>
                    <Text variant="body" style={{ color: theme.colors.text }}>{robot.missionStatus}</Text>
                </View>
            </View>

            <Text variant="caption" color="textMuted">
                Last seen: {formatDistanceToNow(robot.lastSeen)} ago
            </Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 20,
        borderRadius: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(15, 23, 42, 0.08)',
        ...Platform.select({
            web: {
                boxShadow: '0px 4px 8px rgba(15, 23, 42, 0.04)',
            },
            default: {
                shadowColor: "#0F172A",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 3,
            }
        }),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});

export default RobotStatusCard;
