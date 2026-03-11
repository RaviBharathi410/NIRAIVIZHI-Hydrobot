import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { Canvas, Rect } from '@shopify/react-native-skia';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme/restyleTheme';
import Text from '../../components/atoms/Text';
import GlassCard from '../../components/GlassCard';
import { useRobotStore } from '../../store/useRobotStore';


interface Detection {
    id: string;
    label: string;
    box: { x: number; y: number; w: number; h: number };
    confidence: number;
}

export function CameraScreen() {
    const theme = useTheme<Theme>();
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('back');
    const { detections: storeDetections } = useRobotStore();

    // Map store detections to screen format and filter those with boxes (for camera overlay)
    const detections = useMemo(() => {
        return storeDetections
            .filter(d => d.box)
            .map(d => ({
                id: d.id,
                label: d.type,
                box: d.box!,
                confidence: d.confidence
            }));
    }, [storeDetections]);

    useEffect(() => {
        if (!hasPermission) {
            requestPermission();
        }
    }, [hasPermission]);


    if (!hasPermission) return <View style={styles.container}><Text>No access to camera</Text></View>;
    if (!device) return <View style={styles.container}><Text>No camera device found</Text></View>;

    return (
        <View style={styles.container}>
            <Camera
                style={styles.camera}
                device={device}
                isActive={true}
            >
                <Canvas style={StyleSheet.absoluteFill}>
                    {detections.map(det => (
                        <React.Fragment key={det.id}>
                            <Rect
                                x={det.box.x}
                                y={det.box.y}
                                width={det.box.w}
                                height={det.box.h}
                                color="#00E5FF"
                                style="stroke"
                                strokeWidth={2}
                            />
                        </React.Fragment>
                    ))}
                </Canvas>

                <View style={styles.overlay}>
                    <View style={styles.topBar}>
                        <GlassCard style={styles.statusCard}>
                            <View style={styles.statusRow}>
                                <View style={styles.dot} />
                                <Text variant="caption" style={{ color: 'white' }}>AI VISION ACTIVE</Text>
                            </View>
                        </GlassCard>
                    </View>

                    <View style={styles.detectionLog}>
                        <Text variant="caption" style={styles.logTitle}>RECENT DETECTIONS</Text>
                        {detections.map(det => (
                            <GlassCard key={det.id} style={styles.logItem}>
                                <MaterialCommunityIcons name="target" size={16} color="#00E5FF" />
                                <Text variant="caption" style={{ color: 'white', marginLeft: 8 }}>
                                    {det.label} ({(det.confidence * 100).toFixed(0)}%)
                                </Text>
                            </GlassCard>
                        ))}
                    </View>

                    <View style={styles.bottomBar}>
                        <TouchableOpacity style={styles.captureBtn}>
                            <View style={styles.captureInner} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Camera>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between',
    },
    topBar: {
        alignItems: 'flex-start',
        marginTop: 40,
    },
    statusCard: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00E5FF',
        marginRight: 8,
    },
    detectionLog: {
        position: 'absolute',
        right: 20,
        top: 100,
        width: 180,
    },
    logTitle: {
        color: 'white',
        opacity: 0.6,
        marginBottom: 10,
        fontWeight: '700',
    },
    logItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 8,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
    },
    bottomBar: {
        alignItems: 'center',
        marginBottom: 20,
    },
    captureBtn: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
    },
});

export default CameraScreen;
