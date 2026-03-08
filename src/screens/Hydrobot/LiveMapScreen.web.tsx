import React from 'react';
import { View, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { useRobotStore } from '../../store/useRobotStore';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme/restyleTheme';
import Text from '../../components/atoms/Text';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export function LiveMapScreen() {
    const theme = useTheme<Theme>();
    const { robots } = useRobotStore();

    return (
        <View style={styles.container}>
            <View style={[styles.map, styles.webMapPlaceholder]}>
                <MaterialCommunityIcons name="map-search-outline" size={80} color={(theme.colors.primary as string) + '40'} />
                <Text variant="subheading" style={{ marginTop: 20 }}>Live Satellite Tracking (Mobile Only)</Text>
                <Text variant="caption">Google Maps API required for web satellite view</Text>
            </View>

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
        // Using standard CSS box shadow for web
        ...({ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' } as any),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default LiveMapScreen;
