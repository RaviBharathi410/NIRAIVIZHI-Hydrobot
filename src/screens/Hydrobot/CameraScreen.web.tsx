import React from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { useRobotStore, Detection } from '../../store/useRobotStore';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme/restyleTheme';
import Text from '../../components/atoms/Text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { HydrobotTabParamList } from '../../navigation/HydrobotNavigator';

type Props = BottomTabScreenProps<HydrobotTabParamList, 'Fleet'>;

export function CameraScreen({ navigation }: Props) {
    const theme = useTheme<Theme>();
    const { detections } = useRobotStore();

    // Filter detections for recent (last 5s)
    const activeDetections = detections.filter(d =>
        Date.now() - new Date(d.timestamp).getTime() < 5000
    );

    return (
        <View style={styles.container}>
            <View style={styles.webCameraPlaceholder}>
                <MaterialCommunityIcons name="camera-off" size={64} color="#FFF" />
                <Text variant="subheading" style={{ color: '#FFF', marginTop: 16 }}>AI Vision (Active Mode)</Text>
                <Text variant="caption" style={{ color: 'rgba(255,255,255,0.6)' }}>Real-time classification is optimized for mobile hardware</Text>
            </View>

            <DetectionCanvas detections={activeDetections} />

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

function DetectionCanvas({ detections }: { detections: Detection[] }) {
    const { width, height } = Dimensions.get('window');

    return (
        <View style={StyleSheet.absoluteFill}>
            <Svg style={StyleSheet.absoluteFill}>
                {detections.map((det, idx) => {
                    // Random-ish screen positions for the mock
                    const x = (idx * 150) % (width - 150) + 50;
                    const y = (idx * 200) % (height - 200) + 100;
                    const color = det.type === 'CHEMICAL' ? '#A855F7' :
                        det.type === 'PLASTIC' ? '#EF4444' :
                            det.type === 'METAL' ? '#3B82F6' : '#10B981';

                    return (
                        <React.Fragment key={det.id}>
                            <Rect
                                x={x} y={y}
                                width={120} height={120}
                                fill={`${color}30`}
                                stroke={color}
                                strokeWidth={2}
                            />
                            <SvgText x={x + 5} y={y + 15} fontSize={10} fill="#FFF" fontWeight="700">
                                {det.type} ({Math.round(det.confidence * 100)}%)
                            </SvgText>
                        </React.Fragment>
                    );
                })}
            </Svg>
        </View>
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
