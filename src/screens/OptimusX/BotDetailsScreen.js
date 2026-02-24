import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, GRADIENTS, SPACE, SPRING, SHADOWS } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import RingGauge from '../../components/RingGauge';
import SectionHeader from '../../components/SectionHeader';
import AnimatedButton from '../../components/AnimatedButton';

const { width } = Dimensions.get('window');

export default function BotDetailsScreen({ route, navigation }) {
    const { bot } = route.params;

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <MotiView
                    from={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={styles.header}
                >
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                    <View style={styles.botIconWrapper}>
                        <LinearGradient colors={GRADIENTS.primary} style={styles.botIconGlow}>
                            <MaterialCommunityIcons name="robot-industrial" size={60} color={COLORS.white} />
                        </LinearGradient>
                    </View>
                    <Text style={styles.botName}>{bot.name}</Text>
                    <View style={styles.statusBadge}>
                        <View style={[styles.dot, { backgroundColor: COLORS.success }]} />
                        <Text style={styles.statusText}>OPERATIONAL</Text>
                    </View>
                </MotiView>

                <View style={styles.statsGrid}>
                    <GlassCard style={styles.statCard}>
                        <RingGauge value={bot.battery} maxValue={100} size={110} strokeWidth={10} color={COLORS.success} unit="%" />
                        <Text style={styles.statLabel}>Battery</Text>
                    </GlassCard>
                    <GlassCard style={styles.statCard}>
                        <RingGauge value={42} maxValue={100} size={110} strokeWidth={10} color={COLORS.warning} unit="%" />
                        <Text style={styles.statLabel}>Trash Load</Text>
                    </GlassCard>
                </View>

                <SectionHeader title="Diagnostics" />
                <GlassCard>
                    <View style={styles.diagRow}>
                        <View style={styles.diagItem}>
                            <Text style={styles.diagLabel}>Uptime</Text>
                            <Text style={styles.diagValue}>14h 22m</Text>
                        </View>
                        <View style={styles.diagDivider} />
                        <View style={styles.diagItem}>
                            <Text style={styles.diagLabel}>Distance</Text>
                            <Text style={styles.diagValue}>12.4 km</Text>
                        </View>
                        <View style={styles.diagDivider} />
                        <View style={styles.diagItem}>
                            <Text style={styles.diagLabel}>Signal</Text>
                            <Text style={styles.diagValue}>-64 dBm</Text>
                        </View>
                    </View>
                </GlassCard>

                <SectionHeader title="Remote Control" />
                <View style={styles.controls}>
                    <AnimatedButton
                        title="Recall to Dock"
                        variant="outlined"
                        iconLeft="home-import-outline"
                        style={styles.controlBtn}
                    />
                    <AnimatedButton
                        title="Manual Pilot"
                        variant="primary"
                        iconLeft="controller-classic-outline"
                        style={styles.controlBtn}
                        onPress={() => navigation.navigate('AIVision')}
                    />
                </View>

                <GlassCard style={styles.locationCard}>
                    <View style={styles.locationHeader}>
                        <MaterialCommunityIcons name="map-marker-radius" size={24} color={COLORS.accent} />
                        <Text style={styles.locationTitle}>Last Known Location</Text>
                    </View>
                    <View style={styles.mapPlaceholder}>
                        <LinearGradient colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)']} style={StyleSheet.absoluteFill} />
                        <MaterialCommunityIcons name="navigation-variant" size={40} color={COLORS.accent} />
                        <Text style={styles.coordinateText}>Lat: {bot.location.lat} | Lng: {bot.location.lng}</Text>
                    </View>
                </GlassCard>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACE[6], paddingTop: 60, paddingBottom: 60 },
    header: { alignItems: 'center', marginBottom: 30 },
    backBtn: { position: 'absolute', left: 0, top: 0, width: 40, height: 40, justifyContent: 'center' },
    botIconWrapper: { width: 120, height: 120, borderRadius: 60, marginBottom: 20, ...SHADOWS.glow(COLORS.primary, 20, 0.4) },
    botIconGlow: { flex: 1, borderRadius: 60, justifyContent: 'center', alignItems: 'center' },
    botName: { ...FONTS.extraBold, fontSize: 28, color: COLORS.white },
    statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 10 },
    dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
    statusText: { ...FONTS.bold, fontSize: 10, color: COLORS.white, letterSpacing: 1 },
    statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    statCard: { width: '48%', alignItems: 'center', paddingVertical: 20 },
    statLabel: { ...FONTS.bold, fontSize: 12, color: COLORS.textSecondary, marginTop: 12, textTransform: 'uppercase' },
    diagRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 },
    diagItem: { alignItems: 'center' },
    diagLabel: { ...FONTS.semiBold, fontSize: 11, color: COLORS.textMuted, marginBottom: 4 },
    diagValue: { ...FONTS.bold, fontSize: 15, color: COLORS.white },
    diagDivider: { width: 1, height: '100%', backgroundColor: 'rgba(255,255,255,0.08)' },
    controls: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
    controlBtn: { width: '48%' },
    locationCard: { padding: 0, overflow: 'hidden' },
    locationHeader: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    locationTitle: { ...FONTS.bold, fontSize: 16, color: COLORS.white, marginLeft: 12 },
    mapPlaceholder: { height: 160, justifyContent: 'center', alignItems: 'center' },
    coordinateText: { ...FONTS.medium, fontSize: 12, color: COLORS.textSecondary, marginTop: 10 },
});