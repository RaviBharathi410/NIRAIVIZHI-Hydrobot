import React from 'react';
import { View, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polygon, Polyline } from 'react-native-maps';
import { useRobotStore, Robot } from '../../store/useRobotStore';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../constants/restyleTheme';
import Text from '../../components/atoms/Text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HeaderActions from '../../components/HeaderActions';
import { COLORS } from '../../constants/theme';

import { useSharedValue, useAnimatedStyle, withRepeat, withTiming, interpolate } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

export function LiveMapScreen() {
    const theme = useTheme<Theme>();
    const { robots, detections, selectedRobotId, setSelectedRobot } = useRobotStore();

    const selectedRobot = robots.find(r => r.id === selectedRobotId) || robots[0];

    const initialRegion = {
        latitude: selectedRobot?.telemetry.location.latitude || 12.9716,
        longitude: selectedRobot?.telemetry.location.longitude || 77.5946,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    };

    return (
        <View style={styles.container}>
            {Platform.OS === 'web' ? (
                <View style={[styles.map, styles.webMapPlaceholder]}>
                    <MaterialCommunityIcons name="map-search-outline" size={80} color={(theme.colors.primary as string) + '40'} />
                    <Text variant="subheading" style={{ marginTop: 20 }}>Live Satellite Tracking (Mobile Only)</Text>
                    <Text variant="caption">Google Maps API required for web satellite view</Text>
                </View>
            ) : (
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={initialRegion}
                    mapType="satellite"
                    showsUserLocation
                >
                    {robots.map(robot => (
                        <React.Fragment key={robot.id}>
                            {/* Cleaned Path (Trajectory) */}
                            {robot.path && robot.path.length > 1 && (
                                <Polyline
                                    coordinates={robot.path}
                                    strokeColor={robot.status === 'ONLINE' ? '#00E5FF80' : '#94A3B880'}
                                    strokeWidth={20} // Thick to represent cleaned area
                                    lineCap="round"
                                />
                            )}

                            <Marker
                                coordinate={robot.telemetry.location}
                                onPress={() => setSelectedRobot(robot.id)}
                            >
                                <PulseMarker color={robot.status === 'ONLINE' ? '#00E5FF' : '#94A3B8'} />
                            </Marker>
                        </React.Fragment>
                    ))}

                    {detections.map(det => (
                        <Marker
                            key={det.id}
                            coordinate={det.location}
                        >
                            <View style={[styles.detectionMarker, { backgroundColor: theme.colors.danger as string }]}>
                                <MaterialCommunityIcons name="trash-can" size={12} color={theme.colors.background as string} />
                            </View>
                        </Marker>
                    ))}
                </MapView>
            )}

            <SafeAreaView style={styles.overlay}>
                <View style={[styles.card, { backgroundColor: 'rgba(15, 23, 42, 0.8)' }]}>
                    <View style={styles.headerRow}>
                        <View style={styles.row}>
                            <MaterialCommunityIcons name="satellite-variant" size={24} color="#00E5FF" />
                            <View style={{ marginLeft: 12 }}>
                                <Text variant="body" style={{ fontWeight: '700', color: COLORS.text }}>FLEET TRACKING</Text>
                                <Text variant="caption" style={{ color: COLORS.textSecondary }}>
                                    {robots.filter(r => r.status === 'ONLINE').length} Active Units
                                </Text>
                            </View>
                        </View>
                        <HeaderActions />
                    </View>
                </View>
            </SafeAreaView>

            {selectedRobot && (
                <View style={[styles.bottomSheet, { backgroundColor: theme.colors.surface as string }]}>
                    <View style={styles.sheetHeader}>
                        <Text variant="subheading">{selectedRobot.name}</Text>
                        <Text variant="caption" color="primary">{selectedRobot.status}</Text>
                    </View>
                    <View style={styles.sheetStats}>
                        <MapStat label="BATT" value={`${selectedRobot.battery}%`} icon="battery-80" />
                        <MapStat label="SPEED" value={`${selectedRobot.telemetry.speed}m/s`} icon="speedometer" />
                        <MapStat label="pH" value={Number(selectedRobot.telemetry.ph).toFixed(1)} icon="test-tube" />
                    </View>
                </View>
            )}

        </View>
    );
}

function PulseMarker({ color }: { color: string }) {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    React.useEffect(() => {
        scale.value = withRepeat(withTiming(2.5, { duration: 2000 }), -1, false);
        opacity.value = withRepeat(withTiming(0, { duration: 2000 }), -1, false);
    }, []);

    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    return (
        <View style={styles.markerContainer}>
            <Animated.View style={[styles.pulse, { backgroundColor: color }, pulseStyle]} />
            <View style={[styles.markerCore, { backgroundColor: color }]} />
        </View>
    );
}

function MapStat({ label, value, icon }: { label: string, value: string, icon: any }) {
    return (
        <View style={{ alignItems: 'center', flex: 1 }}>
            <MaterialCommunityIcons name={icon} size={20} color="#00E5FF" />
            <Text variant="caption" style={{ fontWeight: '700', marginTop: 4 }}>{value}</Text>
            <Text variant="caption" style={{ fontSize: 10, opacity: 0.5 }}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    webMapPlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
    },
    overlay: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
    },
    card: {
        padding: 16,
        borderRadius: 16,
        ...Platform.select({
            android: { elevation: 10 },
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
            }
        })
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        elevation: 20,
    },
    sheetHeader: {
        marginBottom: 20,
    },
    sheetStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    markerContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pulse: {
        position: 'absolute',
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    markerCore: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: COLORS.text,
    },
    detectionMarker: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: COLORS.text,
    },
});

export default LiveMapScreen;
