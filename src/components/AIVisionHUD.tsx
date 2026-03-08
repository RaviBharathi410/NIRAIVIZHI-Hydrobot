import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACE } from '../constants/theme';
import GlassCard from './GlassCard';

interface Detection {
    object: string;
    confidence: number;
    coords: number[];
    count: number;
}

export default function AIVisionHUD() {
    const [detection, setDetection] = useState<Detection>({
        object: 'Plastic Bottle',
        confidence: 0.98,
        coords: [120, 45, 200, 300],
        count: 142
    });

    useEffect(() => {
        const id = setInterval(() => {
            const items = ['Plastic Bottle', 'Aluminum Can', 'Metal Scrap', 'Bio-waste'];
            setDetection(prev => ({
                ...prev,
                object: items[Math.floor(Math.random() * items.length)],
                confidence: parseFloat((0.9 + Math.random() * 0.09).toFixed(2)),
                count: prev.count + (Math.random() > 0.8 ? 1 : 0)
            }));
        }, 3000);
        return () => clearInterval(id);
    }, []);

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
                            key={detection.object}
                            from={{ opacity: 0, translateX: -10 }}
                            animate={{ opacity: 1, translateX: 0 }}
                            exit={{ opacity: 0, translateX: 10 }}
                        >
                            <Text style={styles.value}>{detection.object}</Text>
                        </MotiView>
                    </AnimatePresence>
                </View>

                <View style={styles.item}>
                    <Text style={styles.label}>CONFIDENCE</Text>
                    <Text style={[styles.value, { color: COLORS.success }]}>{(detection.confidence * 100).toFixed(0)}%</Text>
                </View>

                <View style={styles.item}>
                    <Text style={styles.label}>TOTAL TRASH</Text>
                    <Text style={styles.value}>{detection.count}</Text>
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
