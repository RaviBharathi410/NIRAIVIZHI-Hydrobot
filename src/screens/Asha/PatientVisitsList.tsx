import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS, FONTS, GRADIENTS, SPACE, SHADOWS } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenHeader from '../../components/ScreenHeader';

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
    const VISITS: Visit[] = [
        { id: 1, patient: 'Sanjay Kumar', village: 'North Sector', symptoms: 'Fever, Stomach Ache', risk: 'High', date: 'Mar 10, 2026', time: '10:30 AM' },
        { id: 2, patient: 'Priya Devi', village: 'East Delta', symptoms: 'Severe Dehydration', risk: 'Medium', date: 'Mar 09, 2026', time: '04:15 PM' },
        { id: 3, patient: 'Ravi Verma', village: 'North Sector', symptoms: 'Skin Rash, Itching', risk: 'Low', date: 'Mar 08, 2026', time: '11:00 AM' },
        { id: 4, patient: 'Amit Singh', village: 'Sector 4', symptoms: 'Nausea, Vomiting', risk: 'High', date: 'Mar 08, 2026', time: '09:20 AM' },
    ];

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
            <Animated.View
                entering={FadeInDown.delay(index * 100).springify()}
                style={styles.visitWrapper}
            >
                <TouchableOpacity activeOpacity={0.9}>
                    <GlassCard style={styles.visitCard} variant="heavy">
                        <View style={styles.visitHeader}>
                            <View style={[styles.avatarBox, { backgroundColor: color + '20' }]}>
                                <MaterialCommunityIcons name="account" size={24} color={color} />
                            </View>
                            <View style={styles.patientInfo}>
                                <Text style={styles.patientName}>{item.patient}</Text>
                                <View style={styles.locRow}>
                                    <MaterialCommunityIcons name="map-marker" size={12} color={COLORS.textMuted} />
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
                            <View style={styles.symptomRow}>
                                <MaterialCommunityIcons name="clipboard-text-outline" size={16} color={COLORS.textMuted} />
                                <Text style={styles.symptoms}>{item.symptoms}</Text>
                            </View>
                            <View style={styles.dateRow}>
                                <MaterialCommunityIcons name="calendar-clock" size={14} color={COLORS.textMuted} />
                                <Text style={styles.dateText}>{item.date} • {item.time}</Text>
                            </View>
                        </View>
                    </GlassCard>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <FlatList
                data={VISITS}
                renderItem={renderVisit}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <ScreenHeader
                        title="Patient Visits"
                        subtitle="Visit Registry & Health Logs"
                        showBack={true}
                        style={{ marginTop: 20 }}
                    />
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    listContent: { paddingHorizontal: SPACE[6], paddingBottom: 40, paddingTop: 40 },
    visitWrapper: { marginBottom: 16 },
    visitCard: { padding: 20, borderRadius: 24 },
    visitHeader: { flexDirection: 'row', alignItems: 'center' },
    avatarBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    patientInfo: { flex: 1, marginLeft: 16 },
    patientName: { ...FONTS.bold, fontSize: 17, color: COLORS.text },
    locRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    patientSub: { ...FONTS.medium, fontSize: 12, color: COLORS.textMuted, marginLeft: 4 },
    riskBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
    riskDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
    riskText: { ...FONTS.bold, fontSize: 10, letterSpacing: 1 },
    divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 16 },
    visitBody: { gap: 10 },
    symptomRow: { flexDirection: 'row', alignItems: 'flex-start' },
    symptoms: { ...FONTS.medium, fontSize: 13, color: COLORS.textSecondary, marginLeft: 10, flex: 1, lineHeight: 18 },
    dateRow: { flexDirection: 'row', alignItems: 'center', opacity: 0.7 },
    dateText: { ...FONTS.medium, fontSize: 11, color: COLORS.textMuted, marginLeft: 8 },
});