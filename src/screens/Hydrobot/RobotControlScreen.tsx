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

import { TelemetryStrip } from '../../components/robot/TelemetryStrip';

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
            socketService.sendRobotCommand(robot.id, {
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
        socketService.sendRobotCommand(robot.id, { emergency_stop: true });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background as string }]}>
            {/* Control Header */}
            <View style={styles.header}>
                <View style={styles.headerInfo}>
                    <View>
                        <Text variant="subheading">{robot.name}</Text>
                        <ConnectionBadge status={connectionStatus} />
                    </View>
                    <View style={styles.modeToggle}>
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
            </View>

            {/* Telemetry Strip - 4 cells */}
            <TelemetryStrip
                speed={robot.telemetry.speed}
                heading={robot.telemetry.heading}
                power={100}
                latency={24}
            />

            {/* Main Control Layout */}
            <View style={styles.controlLayout}>
                <View style={styles.centerControls}>
                    <Joystick onCommand={handleJoystick} />
                </View>

                <View style={styles.rightControls}>
                    <SpeedSlider
                        value={robot.telemetry.speed}
                        onValueChange={(v) => {
                            commandRef.current.speed = v;
                            updateTelemetry(robot.id, { telemetry: { ...robot.telemetry, speed: v } } as any);
                        }}
                    />
                </View>
            </View>

            {/* Footer Actions */}
            <View style={styles.footer}>
                <View style={styles.statusFooter}>
                    <Text variant="mono" style={{ fontSize: 12 }}>
                        GPS: {robot.telemetry.location.latitude.toFixed(4)}, {robot.telemetry.location.longitude.toFixed(4)}
                    </Text>
                    <Text variant="caption" style={{ opacity: 0.6 }}>BATTERY: {robot.battery}%</Text>
                </View>
                <EmergencyStopButton onTrigger={handleStop} size={90} />
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
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    headerInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    controlLayout: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    centerControls: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightControls: {
        alignItems: 'center',
        width: 80,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 20,
    },
    statusFooter: {
        flex: 1,
    },
    modeToggle: {
        alignItems: 'flex-end',
    },
    toggleRow: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 4,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    modeBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    connectionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
});

export default RobotControlScreen;
