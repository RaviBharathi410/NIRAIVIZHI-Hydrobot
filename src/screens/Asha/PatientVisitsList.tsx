import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { MotiView } from 'moti';
import { COLORS, FONTS, GRADIENTS, SPACE, SHADOWS } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenHeader from '../../components/ScreenHeader';
import { TextInput } from 'react-native-gesture-handler';

interface Visit {
    id: number;
    patient: string;
    village: string;
    symptoms: string;
    risk: 'High' | 'Medium' | 'Low';
    date: string;
    time: string;
}

export default function PatientVisitsList() {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [filter, setFilter] = React.useState<'All' | 'High' | 'Medium' | 'Low'>('All');

    const VISITS: Visit[] = [
        { id: 1, patient: 'Sanjay Kumar', village: 'North Sector', symptoms: 'Severe Fever, Stomach Ache', risk: 'High', date: 'Mar 10, 2026', time: '10:30 AM' },
        { id: 2, patient: 'Priya Devi', village: 'East Delta', symptoms: 'Severe Dehydration, Weakness', risk: 'Medium', date: 'Mar 09, 2026', time: '04:15 PM' },
        { id: 3, patient: 'Ravi Verma', village: 'North Sector', symptoms: 'Mild Skin Rash, Itching', risk: 'Low', date: 'Mar 08, 2026', time: '11:00 AM' },
        { id: 4, patient: 'Amit Singh', village: 'Sector 4', symptoms: 'Persistent Nausea, Vomiting', risk: 'High', date: 'Mar 08, 2026', time: '09:20 AM' },
        { id: 5, patient: 'Sunita Sharma', village: 'West End', symptoms: 'Cough, Cold', risk: 'Low', date: 'Mar 07, 2026', time: '02:00 PM' },
    ];

    const filteredVisits = VISITS.filter(v => 
        (filter === 'All' || v.risk === filter) && 
        v.patient.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRiskColors = (risk: string) => {
        switch (risk) {
            case 'High': return { color: COLORS.danger, bg: COLORS.danger + '15' };
            case 'Medium': return { color: COLORS.warning, bg: COLORS.warning + '15' };
            default: return { color: COLORS.success, bg: COLORS.success + '15' };
        }
    };

    const renderVisit = ({ item, index }: { item: Visit; index: number }) => {
        const { color, bg } = getRiskColors(item.risk);

        return (
            <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: index * 100, type: 'timing', duration: 400 } as any}
                style={styles.visitWrapper}
            >
                <TouchableOpacity activeOpacity={0.8}>
                    <GlassCard style={styles.visitCard} variant="heavy">
                        <View style={styles.visitHeader}>
                            <View style={[styles.avatarBox, { backgroundColor: color + '20' }]}>
                                <Text style={[styles.avatarText, { color }]}>{item.patient.charAt(0)}</Text>
                            </View>
                            <View style={styles.patientInfo}>
                                <Text style={styles.patientName}>{item.patient}</Text>
                                <View style={styles.locRow}>
                                    <MaterialCommunityIcons name="map-marker-outline" size={14} color={COLORS.textMuted} />
                                    <Text style={styles.patientSub}>{item.village}</Text>
                                </View>
                            </View>
                            <View style={[styles.riskBadge, { backgroundColor: bg }]}>
                                <View style={[styles.riskDot, { backgroundColor: color }]} />
                                <Text style={[styles.riskText, { color }]}>{item.risk.toUpperCase()}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.visitBody}>
                            <View style={styles.detailRow}>
                                <MaterialCommunityIcons name="clipboard-pulse-outline" size={18} color={COLORS.textMuted} />
                                <Text style={styles.symptoms} numberOfLines={2}>{item.symptoms}</Text>
                            </View>
                            <View style={[styles.detailRow, { marginTop: 12 }]}>
                                <View style={styles.timeBadge}>
                                    <MaterialCommunityIcons name="calendar-blank-outline" size={14} color={COLORS.textSecondary} />
                                    <Text style={styles.dateText}>{item.date}</Text>
                                </View>
                                <View style={[styles.timeBadge, { marginLeft: 10 }]}>
                                    <MaterialCommunityIcons name="clock-time-four-outline" size={14} color={COLORS.textSecondary} />
                                    <Text style={styles.dateText}>{item.time}</Text>
                                </View>
                            </View>
                        </View>
                    </GlassCard>
                </TouchableOpacity>
            </MotiView>
        );
    };

    const renderHeader = () => (
        <Animated.View entering={FadeInDown.delay(100).springify()}>
            <ScreenHeader
                title="Patient Visits"
                subtitle="Visit Registry & Health Logs"
                showBack={true}
                style={{ marginTop: 20, marginBottom: 10 }}
            />
            
            <GlassCard style={styles.searchCard}>
                <MaterialCommunityIcons name="magnify" size={24} color={COLORS.textMuted} />
                <TextInput 
                    style={styles.searchInput}
                    placeholder="Search patients, villages..."
                    placeholderTextColor={COLORS.textMuted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </GlassCard>

            <View style={styles.filterScrollWrapper}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    {['All', 'High', 'Medium', 'Low'].map((f) => {
                        const active = filter === f;
                        return (
                            <TouchableOpacity 
                                key={f} 
                                style={[styles.filterChip, active && styles.filterChipActive]}
                                onPress={() => setFilter(f as any)}
                            >
                                {active && <MaterialCommunityIcons name="check-circle" size={14} color={COLORS.primary} style={{ marginRight: 6 }} />}
                                <Text style={[styles.filterText, active && styles.filterTextActive]}>{f}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <FlatList
                data={filteredVisits}
                renderItem={renderVisit}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={renderHeader}
            />

            <MotiView
                from={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', delay: 400 } as any}
                style={styles.fabContainer}
            >
                <TouchableOpacity style={styles.fab}>
                    <LinearGradient colors={GRADIENTS.primary as any} style={styles.fabGradient}>
                        <MaterialCommunityIcons name="plus" size={32} color={COLORS.white} />
                    </LinearGradient>
                </TouchableOpacity>
            </MotiView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    listContent: { paddingHorizontal: SPACE[6], paddingBottom: 100, paddingTop: 10 },
    searchCard: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, marginBottom: 20 },
    searchInput: { flex: 1, marginLeft: 12, ...FONTS.medium, fontSize: 15, color: COLORS.text, height: 40 },
    filterScrollWrapper: { marginBottom: 24, marginHorizontal: -SPACE[6] },
    filterScroll: { paddingHorizontal: SPACE[6], gap: 10 },
    filterChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    filterChipActive: { backgroundColor: COLORS.primary + '20', borderColor: COLORS.primary },
    filterText: { ...FONTS.semiBold, fontSize: 13, color: COLORS.textSecondary },
    filterTextActive: { color: COLORS.primary },
    visitWrapper: { marginBottom: 16 },
    visitCard: { padding: 20, borderRadius: 24 },
    visitHeader: { flexDirection: 'row', alignItems: 'center' },
    avatarBox: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    avatarText: { ...FONTS.extraBold, fontSize: 20 },
    patientInfo: { flex: 1, marginLeft: 16 },
    patientName: { ...FONTS.bold, fontSize: 18, color: COLORS.text },
    locRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    patientSub: { ...FONTS.medium, fontSize: 13, color: COLORS.textMuted, marginLeft: 4 },
    riskBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
    riskDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
    riskText: { ...FONTS.bold, fontSize: 10, letterSpacing: 1 },
    divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: 18 },
    visitBody: { gap: 0 },
    detailRow: { flexDirection: 'row', alignItems: 'center' },
    symptoms: { ...FONTS.medium, fontSize: 14, color: COLORS.textSecondary, marginLeft: 12, flex: 1, lineHeight: 20 },
    timeBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
    dateText: { ...FONTS.medium, fontSize: 12, color: COLORS.textSecondary, marginLeft: 6 },
    fabContainer: { position: 'absolute', bottom: 30, right: 30 },
    fab: { width: 60, height: 60, borderRadius: 30, overflow: 'hidden', ...(SHADOWS.glow(COLORS.primary, 10, 0.4) as any) },
    fabGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});