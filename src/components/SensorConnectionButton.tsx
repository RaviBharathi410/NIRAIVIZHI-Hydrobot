import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SPACE } from '../constants/theme';
import GlassCard from './GlassCard';

interface SensorConnectionButtonProps {
    isConnected: boolean;
    isScanning: boolean;
    onConnect: () => void;
    onDisconnect: () => void;
}

export default function SensorConnectionButton({ isConnected, isScanning, onConnect, onDisconnect }: SensorConnectionButtonProps) {

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (isConnected) onDisconnect();
        else onConnect();
    };

    return (
        <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
            <GlassCard style={[
                styles.card,
                isConnected && { borderColor: COLORS.success + '40' }
            ]}>
                <View style={styles.row}>
                    <View style={styles.iconContainer}>
                        <AnimatePresence exitBeforeEnter>
                            {isScanning ? (
                                <MotiView
                                    key="scanning"
                                    from={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    style={styles.scanPulse}
                                >
                                    <ActivityIndicator color={COLORS.accent} />
                                    <MotiView
                                        from={{ scale: 1, opacity: 0.5 }}
                                        animate={{ scale: 2, opacity: 0 }}
                                        transition={{ loop: true, duration: 1500, type: 'timing' } as any}
                                        style={styles.pulseRing}
                                    />
                                </MotiView>
                            ) : isConnected ? (
                                <MotiView
                                    key="connected"
                                    from={{ scale: 0.5, rotate: '45deg', opacity: 0 }}
                                    animate={{ scale: 1, rotate: '0deg', opacity: 1 }}
                                    style={[styles.statusBadge, { backgroundColor: COLORS.success + '20' }]}
                                >
                                    <MaterialCommunityIcons name="bluetooth-connect" size={24} color={COLORS.success} />
                                </MotiView>
                            ) : (
                                <MotiView
                                    key="disconnected"
                                    from={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    style={styles.statusBadge}
                                >
                                    <MaterialCommunityIcons name="bluetooth-audio" size={24} color={COLORS.textSecondary} />
                                </MotiView>
                            )}
                        </AnimatePresence>
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={styles.title}>
                            {isScanning ? 'Searching...' : isConnected ? 'Device Connected' : 'Sensor Offline'}
                        </Text>
                        <Text style={styles.subtitle}>
                            {isScanning ? 'Locating AquaGuard Pro...' : isConnected ? 'AG-SENSOR-042 active' : 'Tap to scan for sensors'}
                        </Text>
                    </View>

                    <MaterialCommunityIcons
                        name={isConnected ? "close-circle" : "chevron-right"}
                        size={24}
                        color={isConnected ? COLORS.danger + '80' : COLORS.textMuted}
                    />
                </View>
            </GlassCard>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        paddingVertical: SPACE[3],
        marginVertical: SPACE[2],
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        marginLeft: SPACE[3],
    },
    title: {
        ...FONTS.bold,
        fontSize: 16,
        color: COLORS.text,
    },
    subtitle: {
        ...FONTS.regular,
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    statusBadge: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanPulse: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    pulseRing: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: COLORS.accent,
    },
});