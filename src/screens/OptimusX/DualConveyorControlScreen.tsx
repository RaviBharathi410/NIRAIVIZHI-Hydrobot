import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, SPACE } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import SectionHeader from '../../components/SectionHeader';
import AnimatedButton from '../../components/AnimatedButton';
import { useRobotStore } from '../../store/useRobotStore';

const { width } = Dimensions.get('window');

export default function DualConveyorControlScreen() {
    const { robots, selectedRobotId, setConveyorSpeed, connectionStatus } = useRobotStore();
    const robot = robots.find(r => r.id === selectedRobotId) || robots[0];
    const conveyors = robot?.telemetry.conveyors || { belt1: 0, belt2: 0 };
    const isConnected = connectionStatus === 'CONNECTED' && robot?.status === 'ONLINE';

    const c1Speed = conveyors.belt1;
    const c2Speed = conveyors.belt2;
    const isActive = isConnected && (c1Speed > 0 || c2Speed > 0);

    const updateSpeed = (belt: 1 | 2, delta: number) => {
        if (!robot) return;
        const current = belt === 1 ? c1Speed : c2Speed;
        const next = Math.min(100, Math.max(0, current + delta));
        setConveyorSpeed(robot.id, belt, next);
    };


    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <MotiView from={{ opacity: 0, translateY: -10 }} animate={{ opacity: 1, translateY: 0 }}>
                    <Text style={styles.title}>Logistics Core</Text>
                    <Text style={styles.subtitle}>Dual-Belt Feed & Conveyor Optimization</Text>
                </MotiView>

                <SectionHeader title="Belt 01: Sorting" />
                <GlassCard style={styles.conveyorCard} variant="heavy">
                    <View style={styles.beltContainer}>
                        {[...Array(8)].map((_, i) => (
                            <MotiView
                                key={i}
                                from={{ translateX: 0 }}
                                animate={{ translateX: width * 0.7 }}
                                transition={{ loop: true, duration: 2000 * (100 / c1Speed), type: 'timing', delay: i * 250 } as any}
                                style={styles.beltItem}
                            >
                                <MaterialCommunityIcons name="cube-outline" size={20} color={COLORS.accent} />
                            </MotiView>
                        ))}
                        <View style={styles.beltTrack} />
                    </View>
                    <View style={styles.controlsRow}>
                        <View style={styles.speedInfo}>
                            <Text style={styles.speedVal}>{c1Speed}%</Text>
                            <Text style={styles.speedLabel}>VELOCITY</Text>
                        </View>
                        <View style={styles.actionRow}>
                            <TouchableOpacity
                                onPress={() => updateSpeed(1, -10)}
                                style={[styles.speedBtn, !isConnected && styles.disabledBtn]}
                                disabled={!isConnected}
                            >
                                <MaterialCommunityIcons name="minus" size={24} color={COLORS.white} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => updateSpeed(1, 10)}
                                style={[styles.speedBtn, !isConnected && styles.disabledBtn]}
                                disabled={!isConnected}
                            >
                                <MaterialCommunityIcons name="plus" size={24} color={COLORS.white} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </GlassCard>

                <SectionHeader title="Belt 02: Disposal" />
                <GlassCard style={styles.conveyorCard}>
                    <View style={styles.beltContainer}>
                        {[...Array(6)].map((_, i) => (
                            <MotiView
                                key={i}
                                from={{ translateX: 0 }}
                                animate={{ translateX: width * 0.7 }}
                                transition={{ loop: true, duration: c2Speed > 0 ? 2000 * (100 / c2Speed) : 0, type: 'timing', delay: i * 350 } as any}
                                style={styles.beltItem}
                            >
                                <MaterialCommunityIcons name="recycle" size={20} color={COLORS.success} />
                            </MotiView>
                        ))}
                        <View style={styles.beltTrack} />
                    </View>
                    <View style={styles.controlsRow}>
                        <View style={styles.speedInfo}>
                            <Text style={styles.speedVal}>{c2Speed}%</Text>
                            <Text style={styles.speedLabel}>VELOCITY</Text>
                        </View>
                        <View style={styles.actionRow}>
                            <TouchableOpacity
                                onPress={() => updateSpeed(2, -10)}
                                style={[styles.speedBtn, !isConnected && styles.disabledBtn]}
                                disabled={!isConnected}
                            >
                                <MaterialCommunityIcons name="minus" size={24} color={COLORS.white} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => updateSpeed(2, 10)}
                                style={[styles.speedBtn, !isConnected && styles.disabledBtn]}
                                disabled={!isConnected}
                            >
                                <MaterialCommunityIcons name="plus" size={24} color={COLORS.white} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </GlassCard>

                <View style={styles.masterControls}>
                    <AnimatedButton
                        title={isActive ? "EMERGENCY STOP" : "SYSTEM START"}
                        variant={isActive ? "primary" : "outline"}
                        style={[styles.masterBtn, isActive && { backgroundColor: COLORS.danger }]}
                        onPress={() => {
                            if (isActive) {
                                setConveyorSpeed(robot.id, 1, 0);
                                setConveyorSpeed(robot.id, 2, 0);
                            } else {
                                setConveyorSpeed(robot.id, 1, 50);
                                setConveyorSpeed(robot.id, 2, 50);
                            }
                        }}
                        icon={isActive ? "stop" : "play"}
                        disabled={!isConnected}
                    />
                    {!isConnected && (
                        <Text style={styles.offlineWarning}>Robot Link Offline - Controls Restricted</Text>
                    )}
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACE[6], paddingTop: 80, paddingBottom: 60 },
    title: { ...FONTS.extraBold, fontSize: 32, color: COLORS.white },
    subtitle: { ...FONTS.medium, fontSize: 16, color: COLORS.textSecondary, marginBottom: SPACE[6] },
    conveyorCard: { padding: 16, marginBottom: 20 },
    beltContainer: { height: 60, width: '100%', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 10, overflow: 'hidden', justifyContent: 'center' },
    beltTrack: { position: 'absolute', bottom: 10, left: 10, right: 10, height: 4, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 2 },
    beltItem: { position: 'absolute', left: -30 },
    controlsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
    speedInfo: { alignItems: 'flex-start' },
    speedVal: { ...FONTS.extraBold, fontSize: 24, color: COLORS.white },
    speedLabel: { ...FONTS.bold, fontSize: 10, color: COLORS.textMuted, letterSpacing: 1 },
    actionRow: { flexDirection: 'row' },
    speedBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginLeft: 12 },
    disabledBtn: { opacity: 0.3 },
    masterControls: { marginTop: 20 },
    masterBtn: { height: 60 },
    offlineWarning: { ...FONTS.medium, fontSize: 12, color: COLORS.danger, textAlign: 'center', marginTop: 12, letterSpacing: 0.5 },
});
