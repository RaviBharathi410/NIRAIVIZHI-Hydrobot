import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, SPACE } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import RingGauge from '../../components/RingGauge';
import ScreenHeader from '../../components/ScreenHeader';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OptimusXStackParamList } from '../../navigation/OptimusXStack';
import { useRobotStore, Robot } from '../../store/useRobotStore';

type Props = NativeStackScreenProps<OptimusXStackParamList, 'FleetManagement'>;

export interface Bot {
    id: string;
    name: string;
    status: 'active' | 'warning' | 'error' | string;
    battery: number;
    location: {
        lat: number;
        lng: number;
    };
    load?: number;
}

export default function FleetManagementScreen({ navigation }: Props) {
    const { robots } = useRobotStore();

    const formattedBots: Bot[] = robots.map((r: Robot) => ({
        id: r.id,
        name: r.name,
        status: r.status === 'ONLINE' ? 'active' : (r.status === 'ERROR' ? 'error' : 'warning'),
        battery: r.battery,
        location: { lat: r.telemetry.location.latitude, lng: r.telemetry.location.longitude },
        load: r.telemetry.pollutionIndex // Using pollutionIndex as a proxy for cargo load
    }));


    const renderBotItem = ({ item, index }: { item: Bot, index: number }) => (
        <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: index * 100, type: 'spring' } as any}
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

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <ScreenHeader
                title="Fleet Management"
                subtitle={`${formattedBots.length} Active HydroBots on Mission`}
                style={{ paddingHorizontal: SPACE[6], paddingTop: 20 }}
            />

            <FlatList
                data={formattedBots}
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
    title: { ...FONTS.extraBold, fontSize: 32, color: COLORS.text, marginBottom: 8 },
    subtitle: { ...FONTS.medium, fontSize: 16, color: COLORS.textSecondary, marginBottom: SPACE[6] },
    listContent: { paddingHorizontal: SPACE[6], paddingBottom: 40 },
    botWrapper: { marginBottom: 16 },
    botCard: { padding: 16 },
    botHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    statusIndicator: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
    botName: { ...FONTS.bold, fontSize: 18, color: COLORS.text, flex: 1 },
    botMeta: { flexDirection: 'row', marginBottom: 20 },
    metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
    metaText: { ...FONTS.medium, fontSize: 13, color: COLORS.textSecondary, marginLeft: 6 },
    gaugeRow: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
    miniGauge: { alignItems: 'center' },
    gaugeLabel: { ...FONTS.semiBold, fontSize: 10, color: COLORS.textMuted, marginTop: 4, textTransform: 'uppercase' },
    skeletonList: { padding: SPACE[6], paddingTop: 100 },
});