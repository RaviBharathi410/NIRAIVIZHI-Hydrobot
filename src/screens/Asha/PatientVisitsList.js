import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, GRADIENTS, SPACE } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import SectionHeader from '../../components/SectionHeader';
import IconBadge from '../../components/IconBadge';

export default function PatientVisitsList() {
    const VISITS = [
        { id: 1, patient: 'Sanjay Kumar', village: 'North Sector', symptoms: 'Fever, Stomach Ache', risk: 'High', date: 'Today, 10:30' },
        { id: 2, patient: 'Priya Devi', village: 'East Delta', symptoms: 'Dehydration', risk: 'Medium', date: 'Yesterday' },
        { id: 3, patient: 'Ravi Verma', village: 'North Sector', symptoms: 'Skin Rash', risk: 'Low', date: '2d ago' },
    ];

    const renderVisit = ({ item, index }) => (
        <MotiView
            from={{ opacity: 0, translateY: 15 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: index * 100 }}
            style={styles.visitWrapper}
        >
            <GlassCard style={styles.visitCard}>
                <View style={styles.visitHeader}>
                    <IconBadge
                        icon="account-outline"
                        size={44}
                        color={item.risk === 'High' ? COLORS.danger : item.risk === 'Medium' ? COLORS.warning : COLORS.success}
                    />
                    <View style={styles.patientInfo}>
                        <Text style={styles.patientName}>{item.patient}</Text>
                        <Text style={styles.patientSub}>{item.village} • {item.date}</Text>
                    </View>
                    <View style={[styles.riskBadge, { backgroundColor: (item.risk === 'High' ? COLORS.danger : COLORS.warning) + '20' }]}>
                        <Text style={[styles.riskText, { color: item.risk === 'High' ? COLORS.danger : COLORS.warning }]}>{item.risk.toUpperCase()}</Text>
                    </View>
                </View>
                <View style={styles.visitBody}>
                    <Text style={styles.symptomLabel}>REPORTED SYMPTOMS:</Text>
                    <Text style={styles.symptoms}>{item.symptoms}</Text>
                </View>
            </GlassCard>
        </MotiView>
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen} style={StyleSheet.absoluteFill} />

            <View style={styles.header}>
                <Text style={styles.title}>Visit Registry</Text>
                <Text style={styles.subtitle}>Patient Diagnostics & Health Logs</Text>
            </View>

            <FlatList
                data={VISITS}
                renderItem={renderVisit}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { paddingHorizontal: SPACE[6], paddingTop: 80, marginBottom: 20 },
    title: { ...FONTS.extraBold, fontSize: 32, color: COLORS.white },
    subtitle: { ...FONTS.medium, fontSize: 16, color: COLORS.textSecondary },
    listContent: { paddingHorizontal: SPACE[6], paddingBottom: 40 },
    visitWrapper: { marginBottom: 16 },
    visitCard: { padding: 16 },
    visitHeader: { flexDirection: 'row', alignItems: 'center' },
    patientInfo: { flex: 1, marginLeft: 16 },
    patientName: { ...FONTS.bold, fontSize: 18, color: COLORS.white },
    patientSub: { ...FONTS.medium, fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
    riskBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
    riskText: { ...FONTS.extraBold, fontSize: 10, letterSpacing: 1 },
    visitBody: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
    symptomLabel: { ...FONTS.bold, fontSize: 10, color: COLORS.textMuted, letterSpacing: 1 },
    symptoms: { ...FONTS.medium, fontSize: 14, color: COLORS.textSecondary, marginTop: 6 },
});