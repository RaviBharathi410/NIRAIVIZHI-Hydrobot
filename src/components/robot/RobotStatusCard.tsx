import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../constants/restyleTheme';
import { formatDistanceToNow } from 'date-fns';
import GlassCard from '../GlassCard';
import Text from '../atoms/Text';
import Skeleton from '../atoms/Skeleton';
import BatteryGauge from './BatteryGauge';
import ConnectionPulse from './ConnectionPulse';

interface RobotStatusCardProps {
    robot: {
        id: string;
        name: string;
        isOnline: boolean;
        battery: number;
        missionStatus: string;
        lastSeen?: Date | number;
    };
    index: number;
    isLoading?: boolean;
    onPress?: () => void;
}

export function RobotStatusCard({ robot, index, isLoading, onPress }: RobotStatusCardProps) {
    const theme = useTheme<Theme>();

    if (isLoading) {
        return (
            <GlassCard style={styles.card}>
                <Skeleton width="60%" height={20} />
                <View style={{ marginVertical: 12 }}>
                    <Skeleton width="100%" height={60} />
                </View>
                <Skeleton width="40%" height={14} />
            </GlassCard>
        );
    }

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 60).springify()}
            style={styles.container}
        >
            <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
                <GlassCard style={styles.card}>
                    <View style={styles.header}>
                        <Text variant="subheading" style={styles.name}>{robot.name}</Text>
                        <ConnectionPulse connected={robot.isOnline} />
                    </View>

                    <View style={styles.content}>
                        <BatteryGauge percent={robot.battery} size={70} />
                        <View style={styles.statusInfo}>
                            <Text variant="caption" style={styles.missionLabel}>MISSION</Text>
                            <Text variant="body" numberOfLines={1} ellipsizeMode="tail" style={styles.missionText}>
                                {robot.missionStatus}
                            </Text>
                        </View>
                    </View>

                    <Text variant="caption" style={styles.lastSeen}>
                        Last seen: {robot.lastSeen ? formatDistanceToNow(robot.lastSeen) : 'N/A'} ago
                    </Text>
                </GlassCard>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    card: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    name: {
        fontSize: 18,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusInfo: {
        marginLeft: 16,
        flex: 1,
    },
    missionLabel: {
        fontSize: 10,
        fontWeight: '700',
        opacity: 0.6,
        marginBottom: 2,
    },
    missionText: {
        fontSize: 14,
    },
    lastSeen: {
        marginTop: 12,
        opacity: 0.5,
        fontStyle: 'italic',
    },
});

export default RobotStatusCard;
