import React from 'react';
import { View, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polygon } from 'react-native-maps';
import { useRobotStore } from '../../store/useRobotStore';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme/restyleTheme';
import Text from '../../components/atoms/Text';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export function LiveMapScreen() {
    const theme = useTheme<Theme>();
    const { robots } = useRobotStore();

    const initialRegion = {
        latitude: 12.9716,
        longitude: 77.5946,
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
                        <Marker
                            key={robot.id}
                            coordinate={robot.location}
                            title={robot.name}
                            description={robot.missionStatus}
                        >
                            <RobotMarker heading={robot.telemetry.heading} color={robot.isOnline ? (theme.colors.primary as string) : (theme.colors.textMuted as string)} />
                        </Marker>
                    ))}

                    {/* Mock Coverage area */}
                    <Polygon
                        coordinates={[
                            { latitude: 12.972, longitude: 77.595 },
                            { latitude: 12.975, longitude: 77.597 },
                            { latitude: 12.974, longitude: 77.600 },
                            { latitude: 12.971, longitude: 77.596 },
                        ]}
                        fillColor="rgba(99, 102, 241, 0.2)"
                        strokeColor={theme.colors.primary as string}
                        strokeWidth={2}
                    />
                </MapView>
            )}

            <SafeAreaView style={styles.overlay}>
                <View style={[styles.card, { backgroundColor: theme.colors.surface as string }]}>
                    <View style={styles.row}>
                        <MaterialCommunityIcons name="satellite-variant" size={24} color={theme.colors.primary as string} />
                        <View style={{ marginLeft: 12 }}>
                            <Text variant="body" style={{ fontWeight: '700' }}>Live Fleet Tracking</Text>
                            <Text variant="caption">{robots.length} Robots Active</Text>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

function RobotMarker({ heading, color }: { heading: number, color: string }) {
    return (
        <View style={styles.markerContainer}>
            <View style={[styles.markerIcon, { backgroundColor: color, transform: [{ rotate: `${heading}deg` }] }]}>
                <MaterialCommunityIcons name="navigation" size={16} color="#FFF" />
            </View>
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
    markerContainer: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    markerIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
});

export default LiveMapScreen;
