import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { Canvas, Rect, Text as SkiaText, useFont } from '@shopify/react-native-skia';
import { useSharedValue } from 'react-native-reanimated';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme/restyleTheme';
import Text from '../../components/atoms/Text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { HydrobotTabParamList } from '../../navigation/HydrobotNavigator';

type Props = BottomTabScreenProps<HydrobotTabParamList, 'Fleet'>; // Using Fleet as placeholder if Camera isn't explicit

export function CameraScreen({ navigation }: Props) {
    const theme = useTheme<Theme>();
    const device = useCameraDevice('back');
    const [hasPermission, setHasPermission] = useState(false);

    // Detection shared values
    const detections = useSharedValue<any[]>([]);

    useEffect(() => {
        if (Platform.OS === 'web') return;
        (async () => {
            const status = await Camera.requestCameraPermission();
            setHasPermission(status === 'granted');
        })();
    }, []);

    // Mock Frame Processor (Real implementation would use fast-tflite)
    const frameProcessor = Platform.OS === 'web' ? null : useFrameProcessor(() => {
        'worklet';
        // Mock detection every few frames
    }, []);

    if (!hasPermission && Platform.OS !== 'web') return <View style={styles.container}><Text>No Camera Permission</Text></View>;
    if (!device && Platform.OS !== 'web') return <View style={styles.container}><Text>No Device</Text></View>;

    return (
        <View style={styles.container}>
            {Platform.OS === 'web' ? (
                <View style={styles.webCameraPlaceholder}>
                    <MaterialCommunityIcons name="camera-off" size={64} color="#FFF" />
                    <Text variant="subheading" style={{ color: '#FFF', marginTop: 16 }}>AI Vision (Active Mode)</Text>
                    <Text variant="caption" style={{ color: 'rgba(255,255,255,0.6)' }}>Real-time classification is optimized for mobile hardware</Text>
                </View>
            ) : (
                <Camera
                    style={StyleSheet.absoluteFill}
                    device={device!}
                    isActive={true}
                    frameProcessor={frameProcessor!}
                />
            )}

            <DetectionCanvas detections={detections} />

            <SafeAreaView style={styles.hud}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <MaterialCommunityIcons name="chevron-left" size={32} color="#FFF" />
                    </TouchableOpacity>
                    <View style={styles.statusBadge}>
                        <View style={styles.dot} />
                        <Text variant="caption" style={{ color: '#FFF', fontWeight: '700' }}>AI ACTIVE</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <View style={styles.legend}>
                        <LegendItem color="#EF4444" label="Plastic" />
                        <LegendItem color="#10B981" label="Organic" />
                        <LegendItem color="#3B82F6" label="Metal" />
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

function DetectionCanvas({ }: { detections: any }) {
    const font = useFont(null, 12);
    // Mock static detection for visual demo
    return (
        <Canvas style={StyleSheet.absoluteFill}>
            <Rect x={100} y={200} width={150} height={150} color="rgba(239,68,68,0.3)" />
            <Rect x={100} y={200} width={150} height={150} color="#EF4444" strokeWidth={2} style="stroke" />
            <SkiaText x={105} y={215} text="PLASTIC BOTTLE (94%)" font={font!} color="#FFF" />
        </Canvas>
    );
}

function LegendItem({ color, label }: { color: string, label: string }) {
    return (
        <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: color }]} />
            <Text variant="caption" style={{ color: '#FFF', marginLeft: 6 }}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    hud: {
        flex: 1,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    backBtn: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10B981',
        marginRight: 8,
    },
    footer: {
        paddingBottom: 40,
        alignItems: 'center',
    },
    legend: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 12,
        borderRadius: 16,
        gap: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendColor: {
        width: 10,
        height: 10,
        borderRadius: 2,
    },
    webCameraPlaceholder: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#0F172A',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CameraScreen;
