import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, GRADIENTS, SPACE, SPRING } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import SectionHeader from '../../components/SectionHeader';

const { width, height } = Dimensions.get('window');

export default function AIVisionScreen({ navigation }) {
    const [objects, setObjects] = useState([
        { id: 1, label: 'Plastic Bottle', confidence: 0.98, x: 40, y: 150, size: 80 },
        { id: 2, label: 'Algae Bloom', confidence: 0.76, x: 200, y: 300, size: 120 },
        { id: 3, label: 'Oil Slick', confidence: 0.45, x: 100, y: 450, size: 100 },
    ]);

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen} style={StyleSheet.absoluteFill} />

            {/* HUD Background / Camera View Mock */}
            <View style={styles.cameraView}>
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.6)']}
                    style={StyleSheet.absoluteFill}
                />

                {/* Scanning grid animation */}
                <MotiView
                    from={{ translateY: 0 }}
                    animate={{ translateY: height * 0.7 }}
                    transition={{ loop: true, duration: 4000, type: 'timing' }}
                    style={styles.scanLine}
                />

                {/* Detected Objects Overlays */}
                {objects.map((obj, i) => (
                    <MotiView
                        key={obj.id}
                        from={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 500 + i * 200, type: 'spring' }}
                        style={[
                            styles.detectionBox,
                            { top: obj.y, left: obj.x, width: obj.size, height: obj.size, borderColor: obj.confidence > 0.8 ? COLORS.success : COLORS.warning }
                        ]}
                    >
                        <View style={[styles.labelTag, { backgroundColor: obj.confidence > 0.8 ? COLORS.success : COLORS.warning }]}>
                            <Text style={styles.labelText}>{obj.label} {(obj.confidence * 100).toFixed(0)}%</Text>
                        </View>
                        <MotiView
                            from={{ opacity: 0.2 }}
                            animate={{ opacity: 0.5 }}
                            transition={{ loop: true, duration: 1000 }}
                            style={styles.innerGlow}
                        />
                    </MotiView>
                ))}

                {/* Corner HUD elements */}
                <View style={styles.hudTop}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <MaterialCommunityIcons name="chevron-left" size={32} color={COLORS.white} />
                    </TouchableOpacity>
                    <View style={styles.hudBadge}>
                        <MaterialCommunityIcons name="record-circle" size={16} color={COLORS.danger} />
                        <Text style={styles.hudText}>LIVE AI VISION</Text>
                    </View>
                </View>

                <View style={styles.hudBottom}>
                    <GlassCard style={styles.hudMetrics}>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricVal}>32</Text>
                            <Text style={styles.metricLabel}>FPS</Text>
                        </View>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricVal}>4ms</Text>
                            <Text style={styles.metricLabel}>LATENCY</Text>
                        </View>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricVal}>92%</Text>
                            <Text style={styles.metricLabel}>MODEL</Text>
                        </View>
                    </GlassCard>
                </View>
            </View>

            <View style={styles.controls}>
                <SectionHeader title="Classification Parameters" />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    {['Macro-Plastics', 'Micro-Plastics', 'Biological', 'Oils', 'Obstacles'].map((f, i) => (
                        <TouchableOpacity key={f} style={[styles.filterChip, i === 0 && styles.activeChip]}>
                            <Text style={[styles.filterText, i === 0 && styles.activeFilterText]}>{f}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.actionBtn}>
                        <MaterialCommunityIcons name="camera-iris" size={32} color={COLORS.white} />
                        <Text style={styles.btnLabel}>Capture</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
                        <MaterialCommunityIcons name="video-outline" size={32} color={COLORS.accent} />
                        <Text style={styles.btnLabel}>Record</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
                        <MaterialCommunityIcons name="share-variant-outline" size={32} color={COLORS.white} />
                        <Text style={styles.btnLabel}>Export</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    cameraView: { flex: 1, backgroundColor: '#000', overflow: 'hidden' },
    scanLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: COLORS.accent, opacity: 0.5, zIndex: 5 },
    detectionBox: { position: 'absolute', borderWidth: 2, borderRadius: 8, zIndex: 10 },
    labelTag: { position: 'absolute', top: -22, left: -2, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    labelText: { ...FONTS.bold, fontSize: 10, color: COLORS.white },
    innerGlow: { ...StyleSheet.absoluteFillObject, backgroundColor: 'white', borderRadius: 6 },
    hudTop: { position: 'absolute', top: 50, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 20 },
    hudBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    hudText: { ...FONTS.bold, fontSize: 10, color: COLORS.white, marginLeft: 6, letterSpacing: 1 },
    hudBottom: { position: 'absolute', bottom: 30, left: 20, right: 20, zIndex: 20 },
    hudMetrics: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12 },
    metricItem: { alignItems: 'center' },
    metricVal: { ...FONTS.bold, fontSize: 16, color: COLORS.white },
    metricLabel: { ...FONTS.bold, fontSize: 8, color: COLORS.textMuted, marginTop: 2 },
    controls: { height: 260, padding: SPACE[6], backgroundColor: COLORS.background },
    filterScroll: { paddingVertical: 10 },
    filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', marginRight: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    activeChip: { backgroundColor: COLORS.accent + '20', borderColor: COLORS.accent },
    filterText: { ...FONTS.semiBold, fontSize: 13, color: COLORS.textSecondary },
    activeFilterText: { color: COLORS.accent },
    actionRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 25 },
    actionBtn: { alignItems: 'center' },
    btnLabel: { ...FONTS.medium, fontSize: 11, color: COLORS.textSecondary, marginTop: 8 },
});