import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, Pressable, Platform } from 'react-native';
import { useRobotStore } from '../../store/useRobotStore';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme/restyleTheme';
import Text from '../../components/atoms/Text';
import { Joystick } from '../../components/controls/Joystick';
import { SpeedSlider } from '../../components/controls/SpeedSlider';
import { EmergencyStopButton } from '../../components/robot/EmergencyStopButton';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { socketService } from '../../services/socketService';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { HydrobotTabParamList } from '../../navigation/HydrobotNavigator';

type Props = BottomTabScreenProps<HydrobotTabParamList, 'Control'>;

export function RobotControlScreen({ route }: Props) {
    const theme = useTheme<Theme>();
    const { robots, updateRobotTelemetry: updateTelemetry, connectionStatus } = useRobotStore();

    // Fallback to first robot if ID is missing (though should be handled by navigation)
    const activeRobotId = (route.params as any)?.id || (robots.length > 0 ? robots[0].id : '1');
    const robot = robots.find(r => r.id === activeRobotId);

    const [controlMode, setControlMode] = useState<'MANUAL' | 'AUTO'>('MANUAL');
    const commandRef = useRef({ heading: robot?.telemetry.heading || 0, speed: robot?.telemetry.speed || 0 });

    // 20Hz Control Loop (50ms interval)
    useEffect(() => {
        if (controlMode !== 'MANUAL' || !robot) return;

        const interval = setInterval(() => {
            socketService.sendCommand(robot.id, {
                heading: commandRef.current.heading,
                speed: commandRef.current.speed,
            });
        }, 50);

        return () => clearInterval(interval);
    }, [robot, controlMode]);

    if (!robot) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background as string, justifyContent: 'center', alignItems: 'center' }]}>
                <Text variant="subheading">No Robot Connected</Text>
            </SafeAreaView>
        );
    }

    const handleJoystick = (cmd: { x: number; y: number }) => {
        // Compute heading from joystick coordinates
        if (Math.abs(cmd.x) > 0.1 || Math.abs(cmd.y) > 0.1) {
            commandRef.current.heading = (Math.atan2(cmd.y, cmd.x) * (180 / Math.PI)) + 90;
        }
    };

    const handleStop = () => {
        socketService.sendCommand(robot.id, { emergency_stop: true });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background as string }]}>
            {/* Telemetry Header */}
            <View style={styles.header}>
                <View style={styles.headerHeader}>
                    <Text variant="caption">{robot.name}</Text>
                    <ConnectionBadge status={connectionStatus} />
                </View>
                <View style={[styles.telemetryRow, { gap: 20 }]}>
                    <View style={styles.telemetryItem}>
                        <MaterialCommunityIcons name="speedometer" size={20} color={theme.colors.primary as string} />
                        <Text variant="subheading" style={{ marginLeft: 8 }}>{robot.telemetry.speed} m/s</Text>
                    </View>
                    <View style={styles.telemetryItem}>
                        <MaterialCommunityIcons name="compass-outline" size={20} color={theme.colors.primary as string} />
                        <Text variant="subheading" style={{ marginLeft: 8 }}>{robot.telemetry.heading.toFixed(0)}°</Text>
                    </View>
                    <View style={styles.telemetryItem}>
                        <MaterialCommunityIcons name="battery-high" size={20} color={theme.colors.success as string} />
                        <Text variant="subheading" style={{ marginLeft: 8 }}>{robot.battery}%</Text>
                    </View>
                </View>
            </View>

            {/* Control Area */}
            <View style={styles.controlLayout}>
                <View style={styles.leftControls}>
                    <SpeedSlider
                        value={robot.telemetry.speed}
                        onValueChange={(v) => {
                            commandRef.current.speed = v;
                            updateTelemetry(robot.id, { telemetry: { ...robot.telemetry, speed: v } } as any);
                        }}
                    />
                    <Text variant="caption" style={{ marginTop: 10 }}>THROTTLE</Text>
                </View>

                <View style={styles.centerControls}>
                    <Joystick onCommand={handleJoystick} />
                    <Text variant="caption" style={{ marginTop: 20 }}>STEERING</Text>
                </View>
            </View>

            {/* Footer Actions */}
            <View style={styles.footer}>
                <EmergencyStopButton onTrigger={handleStop} size={90} />

                <View style={styles.modeToggle}>
                    <Text variant="caption" style={{ marginBottom: 8 }}>OPERATING MODE</Text>
                    <View style={styles.toggleRow}>
                        <ControlModeBtn
                            label="MANUAL"
                            active={controlMode === 'MANUAL'}
                            onPress={() => setControlMode('MANUAL')}
                        />
                        <ControlModeBtn
                            label="AUTO"
                            active={controlMode === 'AUTO'}
                            onPress={() => setControlMode('AUTO')}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

function ControlModeBtn({ label, active, onPress }: { label: string, active: boolean, onPress: () => void }) {
    const theme = useTheme<Theme>();
    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.modeBtn,
                { backgroundColor: active ? (theme.colors.primary as string) : 'rgba(15, 23, 42, 0.05)' }
            ]}
        >
            <Text variant="caption" style={{ color: active ? '#FFF' : (theme.colors.textSecondary as string), fontWeight: '700' }}>
                {label}
            </Text>
        </Pressable>
    );
}

function ConnectionBadge({ status }: { status: string }) {
    const theme = useTheme<Theme>();
    const color = status === 'CONNECTED' ? (theme.colors.success as string) : status === 'CONNECTING' ? (theme.colors.warning as string) : (theme.colors.danger as string);
    return (
        <View style={styles.connectionBadge}>
            <View style={[styles.statusDot, { backgroundColor: color }]} />
            <Text variant="caption" style={{ color: theme.colors.textSecondary as string, marginLeft: 6 }}>{status}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingVertical: 16,
        marginHorizontal: 20,
        backgroundColor: '#FFF',
        borderRadius: 20,
        marginTop: 20,
        paddingHorizontal: 16,
        ...Platform.select({
            web: {
                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
            } as any,
            default: {
                elevation: 2,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 5,
            }
        }),
    },
    headerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(15, 23, 42, 0.05)',
    },
    telemetryRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    connectionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    telemetryItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    controlLayout: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    leftControls: {
        alignItems: 'center',
        marginRight: 40,
    },
    centerControls: {
        flex: 1,
        alignItems: 'center',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingBottom: 40,
    },
    modeToggle: {
        alignItems: 'flex-end',
    },
    toggleRow: {
        flexDirection: 'row',
        backgroundColor: 'rgba(15, 23, 42, 0.05)',
        borderRadius: 12,
        padding: 4,
    },
    modeBtn: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
});

export default RobotControlScreen;
