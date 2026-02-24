import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, GRADIENTS, SPACE, SPRING } from '../../constants/theme';
import apiService from '../../services/api';
import GlassCard from '../../components/GlassCard';
import RingGauge from '../../components/RingGauge';
import SectionHeader from '../../components/SectionHeader';
import SkeletonLoader from '../../components/SkeletonLoader';

export default function FleetManagementScreen({ navigation }) {
    const [bots, setBots] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBots = async () => {
            const data = await apiService.getBotFleet();
            setBots(data);
            setLoading(false);
        };
        loadBots();
    }, []);

    const renderBotItem = ({ item, index }) => (
        <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: index * 100, type: 'spring' }}
            style={styles.botWrapper}
        >
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate('BotDetails', { bot: item })}
            >
                <GlassCard style={styles.botCard}>
                    <View style={styles.botHeader}>
                        <View style={[styles.statusIndicator, { backgroundColor: item.status === 'active' ? COLORS.success : COLORS.warning }]} />
                        <Text style={styles.botName}>{item.name}</Text>
                        <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.textMuted} />
                    </View>

                    <View style={styles.botMeta}>
                        <View style={styles.metaItem}>
                            <MaterialCommunityIcons name="battery-high" size={16} color={COLORS.success} />
                            <Text style={styles.metaText}>{item.battery}%</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <MaterialCommunityIcons name="crosshairs-gps" size={16} color={COLORS.accent} />
                            <Text style={styles.metaText}>{item.location.lat}, {item.location.lng}</Text>
                        </View>
                    </View>

                    <View style={styles.gaugeRow}>
                        <View style={styles.miniGauge}>
                            <RingGauge value={item.battery} maxValue={100} size={60} strokeWidth={6} color={COLORS.success} />
                            <Text style={styles.gaugeLabel}>Power</Text>
                        </View>
                        <View style={styles.miniGauge}>
                            <RingGauge value={item.load || 45} maxValue={100} size={60} strokeWidth={6} color={COLORS.warning} />
                            <Text style={styles.gaugeLabel}>Cargo</Text>
                        </View>
                        <View style={styles.miniGauge}>
                            <RingGauge value={80} maxValue={100} size={60} strokeWidth={6} color={COLORS.accent} />
                            <Text style={styles.gaugeLabel}>Signal</Text>
                        </View>
                    </View>
                </GlassCard>
            </TouchableOpacity>
        </MotiView>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <LinearGradient colors={GRADIENTS.screen} style={StyleSheet.absoluteFill} />
                <View style={styles.skeletonList}>
                    <SkeletonLoader height={180} borderRadius={20} style={{ marginBottom: 16 }} />
                    <SkeletonLoader height={180} borderRadius={20} style={{ marginBottom: 16 }} />
                    <SkeletonLoader height={180} borderRadius={20} style={{ marginBottom: 16 }} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen} style={StyleSheet.absoluteFill} />

            <View style={styles.header}>
                <Text style={styles.title}>Fleet Command</Text>
                <Text style={styles.subtitle}>{bots.length} Active HydroBots on Mission</Text>
            </View>

            <FlatList
                data={bots}
                renderItem={renderBotItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { paddingHorizontal: SPACE[6], paddingTop: 70, marginBottom: 20 },
    title: { ...FONTS.extraBold, fontSize: 32, color: COLORS.white },
    subtitle: { ...FONTS.medium, fontSize: 16, color: COLORS.textSecondary },
    listContent: { paddingHorizontal: SPACE[6], paddingBottom: 40 },
    botWrapper: { marginBottom: 16 },
    botCard: { padding: 16 },
    botHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    statusIndicator: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
    botName: { ...FONTS.bold, fontSize: 18, color: COLORS.white, flex: 1 },
    botMeta: { flexDirection: 'row', marginBottom: 20 },
    metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
    metaText: { ...FONTS.medium, fontSize: 13, color: COLORS.textSecondary, marginLeft: 6 },
    gaugeRow: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
    miniGauge: { alignItems: 'center' },
    gaugeLabel: { ...FONTS.semiBold, fontSize: 10, color: COLORS.textMuted, marginTop: 4, textTransform: 'uppercase' },
    skeletonList: { padding: SPACE[6], paddingTop: 100 },
});