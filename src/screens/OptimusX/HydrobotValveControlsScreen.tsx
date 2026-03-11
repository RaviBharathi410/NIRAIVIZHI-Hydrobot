import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, SPACE } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import SectionHeader from '../../components/SectionHeader';
import AnimatedButton from '../../components/AnimatedButton';
import { useRobotStore } from '../../store/useRobotStore';

export default function HydrobotValveControlsScreen() {
    const { robots, selectedRobotId, toggleValve, connectionStatus } = useRobotStore();
    const robot = robots.find(r => r.id === selectedRobotId) || robots[0];
    const valves = robot?.telemetry.valves || [];
    const isConnected = connectionStatus === 'CONNECTED' && robot?.status === 'ONLINE';

    const handleToggle = (id: number) => {
        if (!robot) return;
        toggleValve(robot.id, id);
    };


    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <Text style={styles.title}>Valve Control</Text>
                    <Text style={styles.subtitle}>Hydraulic Actuators & Flow Management</Text>
                </MotiView>

                <SectionHeader title="Active Actuators" />
                {valves.map((v, i) => (
                    <MotiView
                        key={v.id}
                        from={{ opacity: 0, translateX: -20 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        transition={{ delay: i * 100 } as any}
                    >
                        <GlassCard style={styles.valveCard} variant={v.status ? 'elevated' : 'default'}>
                            <View style={styles.valveRow}>
                                <View style={[styles.statusIndicator, { backgroundColor: v.status ? COLORS.success : COLORS.textMuted }]} />
                                <View style={styles.valveInfo}>
                                    <Text style={styles.valveName}>{v.name}</Text>
                                    <Text style={styles.valveSub}>{v.status ? `FLOW: ${v.flow} L/min` : 'CLOSED'}</Text>
                                </View>
                                <Switch
                                    value={v.status}
                                    onValueChange={() => handleToggle(v.id)}
                                    trackColor={{ false: 'rgba(255,255,255,0.1)', true: COLORS.success + '60' }}
                                    thumbColor={v.status ? COLORS.success : COLORS.textMuted}
                                    disabled={!isConnected}
                                />

                            </View>
                            {v.status && (
                                <MotiView
                                    from={{ width: '0%' }}
                                    animate={{ width: `${v.flow}%` }}
                                    style={[styles.flowIndicator, { backgroundColor: COLORS.primary }]}
                                />
                            )}
                        </GlassCard>
                    </MotiView>
                ))}

                <SectionHeader title="Emergency Actions" />
                <View style={styles.emergencyActions}>
                    <AnimatedButton
                        title="Full System Purge"
                        variant="outline"
                        style={styles.eBtn}
                        icon="alert-decagram-outline"
                    />
                    <AnimatedButton
                        title="Lock All Valves"
                        variant="primary"
                        style={[styles.eBtn, { backgroundColor: COLORS.danger }]}
                        icon="lock-alert-outline"
                    />
                </View>

                <GlassCard style={styles.diagramCard}>
                    <Text style={styles.diagTitle}>Hydraulic Logic Board</Text>
                    <View style={styles.diagramMock}>
                        <MaterialCommunityIcons name="engine-outline" size={32} color={COLORS.accent} />
                        <View style={styles.line} />
                        <MaterialCommunityIcons name="water-pump" size={32} color={COLORS.primary} />
                        <View style={[styles.line, { backgroundColor: COLORS.success }]} />
                        <MaterialCommunityIcons name="valve" size={32} color={COLORS.success} />
                    </View>
                </GlassCard>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACE[6], paddingTop: 80, paddingBottom: 60 },
    title: { ...FONTS.extraBold, fontSize: 32, color: COLORS.white },
    subtitle: { ...FONTS.medium, fontSize: 16, color: COLORS.textSecondary, marginBottom: SPACE[6] },
    valveCard: { marginBottom: 12, paddingVertical: 16 },
    valveRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
    statusIndicator: { width: 12, height: 12, borderRadius: 6, marginRight: 15 },
    valveInfo: { flex: 1 },
    valveName: { ...FONTS.bold, fontSize: 16, color: COLORS.white },
    valveSub: { ...FONTS.medium, fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
    flowIndicator: { height: 2, position: 'absolute', bottom: 0, left: 16, borderRadius: 1 },
    emergencyActions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
    eBtn: { width: '48%' },
    diagramCard: { padding: 20 },
    diagTitle: { ...FONTS.bold, fontSize: 16, color: COLORS.white, marginBottom: 20 },
    diagramMock: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    line: { width: 40, height: 2, backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 5 },
});