import React from 'react';
import { View, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import { useRobotStore } from '../../store/useRobotStore';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme/restyleTheme';
import Text from '../../components/atoms/Text';
import { RobotStatusCard } from '../../components/robot/RobotStatusCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { HydrobotTabParamList } from '../../navigation/HydrobotNavigator';

type Props = BottomTabScreenProps<HydrobotTabParamList, 'Fleet'>;

export function DashboardScreen({ }: Props) {
    const theme = useTheme<Theme>();
    const { robots, isLoading, connectionStatus } = useRobotStore();
    const { width } = useWindowDimensions();
    const numColumns = width > 600 ? 2 : 1;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background as string }]}>
            <Animated.View entering={FadeIn.delay(200)} style={styles.header}>
                <View>
                    <Text variant="heading">NIRAIVIZHI</Text>
                    <Text variant="caption">Fleet Overview & Control</Text>
                </View>
                <View style={styles.headerRight}>
                    <ConnectionBadge status={connectionStatus} />
                    <View style={styles.statsIcon}>
                        <MaterialCommunityIcons name="robot" size={24} color={theme.colors.primary as string} />
                    </View>
                </View>
            </Animated.View>

            <View style={styles.summaryRow}>
                <SummaryRing label="Active" count={robots.filter(r => r.isOnline).length} color={theme.colors.success as string} />
                <SummaryRing label="Total" count={robots.length} color={theme.colors.primary as string} />
                <SummaryRing label="Alerts" count={2} color={theme.colors.danger as string} />
            </View>

            <FlashList
                data={robots}
                renderItem={({ item, index }) => (
                    <RobotStatusCard
                        robot={item}
                        index={index}
                        isLoading={isLoading}
                    />
                )}
                estimatedItemSize={140}
                numColumns={numColumns}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={() => (
                    <Text variant="subheading" style={{ marginBottom: 16 }}>FLEET STATUS</Text>
                )}
            />

            {/* Floating Action Button (simplified for now) */}
            <Animated.View entering={SlideInRight.delay(800)} style={styles.fabContainer}>
                <View style={[styles.fab, { backgroundColor: theme.colors.primary as string }]}>
                    <MaterialCommunityIcons name="plus" size={30} color="#FFF" />
                </View>
            </Animated.View>
        </View>
    );
}

function ConnectionBadge({ status }: { status: string }) {
    const theme = useTheme<Theme>();
    const color = status === 'CONNECTED' ? (theme.colors.success as string) : status === 'CONNECTING' ? (theme.colors.warning as string) : (theme.colors.danger as string);
    return (
        <View style={[styles.connectionBadge, { borderColor: color + '40' }]}>
            <View style={[styles.statusDot, { backgroundColor: color }]} />
            <Text variant="caption" style={{ color: theme.colors.textSecondary as string, marginLeft: 6 }}>{status}</Text>
        </View>
    );
}

function SummaryRing({ label, count, color }: { label: string, count: number, color: string }) {
    return (
        <View style={styles.summaryRing}>
            <View style={[styles.ringInner, { borderColor: color }]}>
                <Text variant="subheading" style={{ color }}>{count}</Text>
            </View>
            <Text variant="caption" style={{ marginTop: 4 }}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 24,
    },
    statsIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    connectionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 12,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        marginBottom: 20,
    },
    summaryRing: {
        alignItems: 'center',
    },
    ringInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    fabContainer: {
        position: 'absolute',
        bottom: 30,
        right: 24,
    },
    fab: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            web: {
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
            } as any,
            default: {
                elevation: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
            }
        }),
    },
});

export default DashboardScreen;
