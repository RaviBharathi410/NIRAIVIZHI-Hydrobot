import React, { useState, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { useRobotStore, Robot } from '../../store/useRobotStore';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme/restyleTheme';
import Text from '../../components/atoms/Text';
import { RobotStatusCard } from '../../components/robot/RobotStatusCard';
import Button from '../../components/atoms/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GlassCard from '../../components/GlassCard';
import { socketService } from '../../services/socketService';

type ViewMode = 'grid' | 'list';

export function FleetManagementScreen() {
    const theme = useTheme<Theme>();
    const { robots } = useRobotStore();
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [multiSelect, setMultiSelect] = useState(false);
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const handleLongPress = useCallback((robotId: string) => {
        setMultiSelect(true);
        setSelected(new Set([robotId]));
    }, []);

    const handlePress = useCallback((robotId: string) => {
        if (!multiSelect) return;
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(robotId)) next.delete(robotId);
            else next.add(robotId);
            return next;
        });
    }, [multiSelect]);

    const cancelMultiSelect = useCallback(() => {
        setMultiSelect(false);
        setSelected(new Set());
    }, []);

    const sendBatchCommand = useCallback((command: string) => {
        selected.forEach(id => {
            socketService.sendCommand(id, { command });
        });
        setMultiSelect(false);
        setSelected(new Set());
    }, [selected]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background as string }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text variant="heading">FLEET</Text>
                        <Text variant="caption">
                            {multiSelect ? `${selected.size} selected` : 'System Maintenance & Health'}
                        </Text>
                    </View>
                    <View style={styles.headerRight}>
                        {multiSelect ? (
                            <TouchableOpacity onPress={cancelMultiSelect}>
                                <Text variant="caption" style={{ color: theme.colors.danger as string, fontWeight: '700' }}>CANCEL</Text>
                            </TouchableOpacity>
                        ) : (
                            <ViewToggle mode={viewMode} onChange={setViewMode} />
                        )}
                    </View>
                </View>

                {/* Fleet Summary Cards */}
                <View style={styles.fleetSummary}>
                    <HealthCard label="Total Units" value={robots.length.toString()} icon="robot" />
                    <HealthCard label="Online" value={robots.filter(r => r.isOnline).length.toString()} icon="check-circle" color="#34D399" />
                    <HealthCard label="Low Battery" value={robots.filter(r => r.battery < 20).length.toString()} icon="battery-low" color="#FF6B6B" />
                </View>

                {/* Robot List/Grid */}
                <Text variant="subheading" style={{ marginBottom: 16 }}>CONNECTED UNITS</Text>

                <View style={viewMode === 'grid' ? styles.gridContainer : undefined}>
                    {robots.map((robot, index) => (
                        <Animated.View
                            key={robot.id}
                            entering={FadeInDown.delay(index * 80).springify()}
                            layout={Layout.springify()}
                            style={viewMode === 'grid' ? styles.gridItem : undefined}
                        >
                            {viewMode === 'grid' ? (
                                <GridRobotCard
                                    robot={robot}
                                    isSelected={selected.has(robot.id)}
                                    multiSelect={multiSelect}
                                    onPress={() => handlePress(robot.id)}
                                    onLongPress={() => handleLongPress(robot.id)}
                                />
                            ) : (
                                <ListRobotCard
                                    robot={robot}
                                    isSelected={selected.has(robot.id)}
                                    multiSelect={multiSelect}
                                    onPress={() => handlePress(robot.id)}
                                    onLongPress={() => handleLongPress(robot.id)}
                                />
                            )}
                        </Animated.View>
                    ))}
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Batch Command Bar */}
            {multiSelect && selected.size > 0 && (
                <Animated.View
                    entering={FadeInDown.springify()}
                    style={[styles.batchBar, { backgroundColor: theme.colors.surface as string }]}
                >
                    <BatchButton
                        icon="play"
                        label="Start"
                        color={theme.colors.primary as string}
                        onPress={() => sendBatchCommand('start_mission')}
                    />
                    <BatchButton
                        icon="home"
                        label="Return"
                        color={theme.colors.primary as string}
                        onPress={() => sendBatchCommand('return_home')}
                    />
                    <BatchButton
                        icon="wrench"
                        label="Calibrate"
                        color={theme.colors.warning as string}
                        onPress={() => sendBatchCommand('calibrate')}
                    />
                    <BatchButton
                        icon="alert-octagon"
                        label="E-Stop"
                        color="#FF6B6B"
                        onPress={() => sendBatchCommand('emergency_stop')}
                    />
                </Animated.View>
            )}
        </SafeAreaView>
    );
}

function ViewToggle({ mode, onChange }: { mode: ViewMode; onChange: (v: ViewMode) => void }) {
    const theme = useTheme<Theme>();
    return (
        <View style={styles.viewToggle}>
            <TouchableOpacity
                onPress={() => onChange('grid')}
                style={[styles.toggleBtn, mode === 'grid' && { backgroundColor: theme.colors.primary as string }]}
            >
                <MaterialCommunityIcons name="view-grid" size={18} color={mode === 'grid' ? 'white' : theme.colors.textMuted as string} />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => onChange('list')}
                style={[styles.toggleBtn, mode === 'list' && { backgroundColor: theme.colors.primary as string }]}
            >
                <MaterialCommunityIcons name="view-list" size={18} color={mode === 'list' ? 'white' : theme.colors.textMuted as string} />
            </TouchableOpacity>
        </View>
    );
}

function GridRobotCard({ robot, isSelected, multiSelect, onPress, onLongPress }: {
    robot: Robot; isSelected: boolean; multiSelect: boolean; onPress: () => void; onLongPress: () => void;
}) {
    const theme = useTheme<Theme>();
    const batteryColor = robot.battery > 50 ? '#34D399' : robot.battery > 20 ? '#FFA94D' : '#FF6B6B';

    return (
        <Pressable onPress={onPress} onLongPress={onLongPress}>
            <GlassCard style={[
                styles.gridCard,
                isSelected && { borderWidth: 2, borderColor: theme.colors.primary as string }
            ]}>
                {multiSelect && (
                    <View style={[styles.checkbox, isSelected && { backgroundColor: theme.colors.primary as string }]}>
                        {isSelected && <MaterialCommunityIcons name="check" size={14} color="white" />}
                    </View>
                )}
                <View style={styles.gridCardHeader}>
                    <Text variant="body" style={{ fontWeight: '600' }} numberOfLines={1}>{robot.name}</Text>
                    <View style={[styles.statusDot, { backgroundColor: robot.isOnline ? '#34D399' : '#FF6B6B' }]} />
                </View>
                <Text variant="caption" numberOfLines={1} style={{ marginTop: 4, opacity: 0.7 }}>
                    {robot.missionStatus}
                </Text>
                {/* Battery bar */}
                <View style={styles.batteryContainer}>
                    <View style={styles.batteryTrack}>
                        <View style={[styles.batteryFill, { width: `${robot.battery}%`, backgroundColor: batteryColor }]} />
                    </View>
                    <Text variant="mono" style={{ fontSize: 11, color: batteryColor }}>{robot.battery}%</Text>
                </View>
            </GlassCard>
        </Pressable>
    );
}

function ListRobotCard({ robot, isSelected, multiSelect, onPress, onLongPress }: {
    robot: Robot; isSelected: boolean; multiSelect: boolean; onPress: () => void; onLongPress: () => void;
}) {
    const theme = useTheme<Theme>();
    const batteryColor = robot.battery > 50 ? '#34D399' : robot.battery > 20 ? '#FFA94D' : '#FF6B6B';

    return (
        <Pressable onPress={onPress} onLongPress={onLongPress}>
            <GlassCard style={[
                styles.listCard,
                isSelected && { borderWidth: 2, borderColor: theme.colors.primary as string }
            ]}>
                <View style={styles.listCardRow}>
                    {multiSelect && (
                        <View style={[styles.checkbox, isSelected && { backgroundColor: theme.colors.primary as string }]}>
                            {isSelected && <MaterialCommunityIcons name="check" size={14} color="white" />}
                        </View>
                    )}
                    <View style={[styles.statusDot, { backgroundColor: robot.isOnline ? '#34D399' : '#FF6B6B', marginRight: 12 }]} />
                    <View style={{ flex: 1 }}>
                        <Text variant="body" style={{ fontWeight: '600' }}>{robot.name}</Text>
                        <Text variant="caption" style={{ marginTop: 2 }}>{robot.missionStatus}</Text>
                    </View>
                    <View style={styles.listCardRight}>
                        {/* Battery */}
                        <View style={styles.listBattery}>
                            <MaterialCommunityIcons
                                name={robot.battery > 50 ? 'battery' : robot.battery > 20 ? 'battery-50' : 'battery-low'}
                                size={18} color={batteryColor}
                            />
                            <Text variant="mono" style={{ fontSize: 12, color: batteryColor, marginLeft: 4 }}>{robot.battery}%</Text>
                        </View>
                        {/* GPS */}
                        <Text variant="caption" style={{ fontSize: 10, opacity: 0.5, marginTop: 4 }}>
                            {robot.location.latitude.toFixed(3)}, {robot.location.longitude.toFixed(3)}
                        </Text>
                    </View>
                    {!multiSelect && (
                        <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.textMuted as string} style={{ marginLeft: 8 }} />
                    )}
                </View>
            </GlassCard>
        </Pressable>
    );
}

function HealthCard({ label, value, icon, color }: { label: string; value: string; icon: any; color?: string }) {
    const theme = useTheme<Theme>();
    return (
        <GlassCard style={styles.healthCard}>
            <MaterialCommunityIcons name={icon} size={24} color={color || theme.colors.primary as string} />
            <Text variant="subheading" style={{ fontWeight: '700', marginTop: 8 }}>{value}</Text>
            <Text variant="caption" style={{ fontSize: 10, opacity: 0.6 }}>{label.toUpperCase()}</Text>
        </GlassCard>
    );
}

function BatchButton({ icon, label, color, onPress }: {
    icon: string; label: string; color: string; onPress: () => void;
}) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.batchBtn}>
            <View style={[styles.batchBtnIcon, { backgroundColor: color + '20' }]}>
                <MaterialCommunityIcons name={icon as any} size={22} color={color} />
            </View>
            <Text variant="caption" style={{ fontSize: 10, fontWeight: '600', marginTop: 4 }}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewToggle: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 4,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    toggleBtn: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    fleetSummary: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 32,
    },
    healthCard: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    gridItem: {
        width: '48%',
        flexGrow: 1,
    },
    gridCard: {
        padding: 16,
        minHeight: 120,
    },
    gridCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    batteryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        gap: 8,
    },
    batteryTrack: {
        flex: 1,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    batteryFill: {
        height: 6,
        borderRadius: 3,
    },
    listCard: {
        padding: 16,
        marginBottom: 12,
    },
    listCardRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listCardRight: {
        alignItems: 'flex-end',
    },
    listBattery: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    batchBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    batchBtn: {
        alignItems: 'center',
    },
    batchBtnIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default FleetManagementScreen;
