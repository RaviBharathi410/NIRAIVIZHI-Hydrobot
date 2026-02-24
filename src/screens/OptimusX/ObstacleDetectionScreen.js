import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, GRADIENTS, SPACE, SHADOWS } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import SectionHeader from '../../components/SectionHeader';
import IconBadge from '../../components/IconBadge';

export default function ObstacleDetectionScreen() {
    const [obstacles, setObstacles] = useState([
        { id: 1, angle: 45, distance: 3.2, type: 'Static' },
        { id: 2, angle: 120, distance: 1.5, type: 'Moving' },
        { id: 3, angle: 280, distance: 4.0, type: 'Static' },
    ]);

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <Text style={styles.title}>SafePath™</Text>
                    <Text style={styles.subtitle}>Autonomous Navigation & Obstacle Mapping</Text>
                </MotiView>

                <View style={styles.radarWrapper}>
                    <GlassCard style={styles.radarContainer} variant="heavy">
                        {/* Radar Rings */}
                        <View style={[styles.ring, { width: 280, height: 280, borderRadius: 140 }]} />
                        <View style={[styles.ring, { width: 200, height: 200, borderRadius: 100 }]} />
                        <View style={[styles.ring, { width: 120, height: 120, borderRadius: 60 }]} />

                        {/* Radar Sweep */}
                        <MotiView
                            from={{ rotate: '0deg' }}
                            animate={{ rotate: '360deg' }}
                            transition={{ loop: true, duration: 4000, type: 'timing' }}
                            style={styles.sweep}
                        >
                            <LinearGradient
                                colors={[COLORS.accent, 'transparent']}
                                style={styles.sweepGradient}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                            />
                        </MotiView>

                        {/* Bot Indicator */}
                        <View style={styles.botCenter}>
                            <MaterialCommunityIcons name="navigation-variant" size={24} color={COLORS.white} />
                        </View>

                        {/* Detected Obstacles */}
                        {obstacles.map(obj => (
                            <MotiView
                                key={obj.id}
                                from={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1000 }}
                                style={[
                                    styles.obstacleDot,
                                    {
                                        transform: [
                                            { rotate: `${obj.angle}deg` },
                                            { translateY: -obj.distance * 30 }
                                        ]
                                    }
                                ]}
                            >
                                <View style={[styles.dot, { backgroundColor: obj.type === 'Moving' ? COLORS.danger : COLORS.warning }]} />
                            </MotiView>
                        ))}
                    </GlassCard>
                </View>

                <SectionHeader title="Proximity Alert Log" />
                {obstacles.map((obj, i) => (
                    <GlassCard key={obj.id} style={styles.logCard}>
                        <View style={styles.logRow}>
                            <IconBadge
                                icon={obj.type === 'Moving' ? "run" : "close-octagon-outline"}
                                size={40}
                                color={obj.type === 'Moving' ? COLORS.danger : COLORS.warning}
                            />
                            <View style={styles.logInfo}>
                                <Text style={styles.logTitle}>{obj.type} Obstacle Detected</Text>
                                <Text style={styles.logSub}>Distance: {obj.distance}m • Bearing: {obj.angle}°</Text>
                            </View>
                            <View style={[styles.severityBadge, { backgroundColor: obj.distance < 2 ? COLORS.danger + '20' : COLORS.warning + '20' }]}>
                                <Text style={[styles.severityText, { color: obj.distance < 2 ? COLORS.danger : COLORS.warning }]}>
                                    {obj.distance < 2 ? 'CRITICAL' : 'NEAR'}
                                </Text>
                            </View>
                        </View>
                    </GlassCard>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACE[6], paddingTop: 80, paddingBottom: 60 },
    title: { ...FONTS.extraBold, fontSize: 32, color: COLORS.white },
    subtitle: { ...FONTS.medium, fontSize: 16, color: COLORS.textSecondary, marginBottom: SPACE[6] },
    radarWrapper: { alignItems: 'center', marginVertical: 30 },
    radarContainer: { width: 320, height: 320, borderRadius: 160, justifyContent: 'center', alignItems: 'center', padding: 0, overflow: 'hidden' },
    ring: { position: 'absolute', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    sweep: { position: 'absolute', width: 320, height: 320, justifyContent: 'center', alignItems: 'center' },
    sweepGradient: { width: 160, height: 160, position: 'absolute', left: 160, opacity: 0.3, borderTopRightRadius: 160 },
    botCenter: { zIndex: 20 },
    obstacleDot: { position: 'absolute', zIndex: 10 },
    dot: { width: 8, height: 8, borderRadius: 4, ...SHADOWS.glow(COLORS.warning, 10, 0.4) },
    logCard: { marginBottom: 10, paddingVertical: 12 },
    logRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
    logInfo: { flex: 1, marginLeft: 16 },
    logTitle: { ...FONTS.bold, fontSize: 15, color: COLORS.white },
    logSub: { ...FONTS.medium, fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
    severityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    severityText: { ...FONTS.extraBold, fontSize: 9 },
});