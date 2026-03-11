import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACE } from '../constants/theme';
import GlassCard from './GlassCard';
import { useRobotStore } from '../store/useRobotStore';

export default function AIVisionHUD() {
    const { detections, missionStats } = useRobotStore();

    const latestDetection = useMemo(() => {
        if (detections.length === 0) return null;
        return detections[0];
    }, [detections]);

    const displayObject = latestDetection ? latestDetection.type : 'Scanning...';
    const displayConfidence = latestDetection ? latestDetection.confidence : 0;


    return (
        <GlassCard style={styles.container} variant="elevated">
            <View style={styles.header}>
                <MaterialCommunityIcons name="eye-outline" size={20} color={COLORS.primary} />
                <Text style={styles.title}>YOLOv8 REAL-TIME DETECTION</Text>
            </View>

            <View style={styles.row}>
                <View style={styles.item}>
                    <Text style={styles.label}>OBJECT</Text>
                    <AnimatePresence exitBeforeEnter>
                        <MotiView
                            key={displayObject}
                            from={{ opacity: 0, translateX: -10 }}
                            animate={{ opacity: 1, translateX: 0 }}
                            exit={{ opacity: 0, translateX: 10 }}
                        >
                            <Text style={styles.value}>{displayObject}</Text>
                        </MotiView>
                    </AnimatePresence>
                </View>

                <View style={styles.item}>
                    <Text style={styles.label}>CONFIDENCE</Text>
                    <Text style={[styles.value, { color: displayConfidence > 0.8 ? COLORS.success : COLORS.warning }]}>
                        {latestDetection ? (displayConfidence * 100).toFixed(0) + '%' : '--'}
                    </Text>
                </View>

                <View style={styles.item}>
                    <Text style={styles.label}>TOTAL TRASH</Text>
                    <Text style={styles.value}>{missionStats.totalTrash}</Text>
                </View>
            </View>


            <View style={styles.footer}>
                <View style={styles.scannerLine} />
                <Text style={styles.status}>SCANNING FOR OBSTACLES...</Text>
            </View>
        </GlassCard>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: SPACE[4],
        marginBottom: SPACE[6],
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACE[4],
    },
    title: {
        ...FONTS.bold,
        fontSize: 10,
        color: COLORS.textMuted,
        letterSpacing: 2,
        marginLeft: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACE[4],
    },
    item: {
        flex: 1,
    },
    label: {
        ...FONTS.bold,
        fontSize: 8,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    value: {
        ...FONTS.semiBold,
        fontSize: 14,
        color: COLORS.text,
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        paddingTop: SPACE[3],
    },
    status: {
        ...FONTS.medium,
        fontSize: 9,
        color: COLORS.primary,
        letterSpacing: 1.5,
    },
    scannerLine: {
        height: 1,
        backgroundColor: COLORS.primary,
        width: '100%',
        opacity: 0.3,
        marginBottom: 8,
    }
});
