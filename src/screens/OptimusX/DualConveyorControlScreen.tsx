import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, SPACE } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import SectionHeader from '../../components/SectionHeader';
import AnimatedButton from '../../components/AnimatedButton';

const { width } = Dimensions.get('window');

export default function DualConveyorControlScreen() {
    const [c1Speed, setC1Speed] = useState(65);
    const [c2Speed, setC2Speed] = useState(40);
    const [isActive, setIsActive] = useState(true);

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
                            <TouchableOpacity onPress={() => setC1Speed(Math.max(0, c1Speed - 10))} style={styles.speedBtn}>
                                <MaterialCommunityIcons name="minus" size={24} color={COLORS.white} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setC1Speed(Math.min(100, c1Speed + 10))} style={styles.speedBtn}>
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
                                transition={{ loop: true, duration: 2000 * (100 / c2Speed), type: 'timing', delay: i * 350 } as any}
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
                            <TouchableOpacity onPress={() => setC2Speed(Math.max(0, c2Speed - 10))} style={styles.speedBtn}>
                                <MaterialCommunityIcons name="minus" size={24} color={COLORS.white} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setC2Speed(Math.min(100, c2Speed + 10))} style={styles.speedBtn}>
                                <MaterialCommunityIcons name="plus" size={24} color={COLORS.white} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </GlassCard>

                <View style={styles.masterControls}>
                    <AnimatedButton
                        title={isActive ? "PAUSE LINE" : "RESUME LINE"}
                        variant={isActive ? "primary" : "outline"}
                        style={styles.masterBtn}
                        onPress={() => setIsActive(!isActive)}
                        icon={isActive ? "pause" : "play"}
                    />
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
    masterControls: { marginTop: 20 },
    masterBtn: { height: 60 },
});