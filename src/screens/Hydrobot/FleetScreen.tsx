import React, { useState } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRobotStore } from '../../store/useRobotStore';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme/restyleTheme';
import Text from '../../components/atoms/Text';
import { RobotStatusCard } from '../../components/robot/RobotStatusCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export function FleetScreen() {
    const theme = useTheme<Theme>();
    const { robots, connectionStatus } = useRobotStore();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background as string }]}>
            <View style={styles.header}>
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text variant="heading">Robot Fleet</Text>
                        <ConnectionStatusDot status={connectionStatus} />
                    </View>
                    <Text variant="caption">{robots.length} Units Registered</Text>
                </View>
                <TouchableOpacity
                    onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    style={[styles.toggleBtn, { backgroundColor: theme.colors.surface as string }]}
                >
                    <MaterialCommunityIcons
                        name={viewMode === 'grid' ? 'format-list-bulleted' : 'view-grid'}
                        size={24}
                        color={theme.colors.primary as string}
                    />
                </TouchableOpacity>
            </View>

            <FlatList
                data={robots}
                key={viewMode}
                numColumns={viewMode === 'grid' ? 2 : 1}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item, index }) => (
                    <View style={viewMode === 'grid' ? styles.gridItem : styles.listItem}>
                        <RobotStatusCard robot={item} index={index} />
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

function ConnectionStatusDot({ status }: { status: string }) {
    const theme = useTheme<Theme>();
    const color = status === 'CONNECTED' ? (theme.colors.success as string) : status === 'CONNECTING' ? (theme.colors.warning as string) : (theme.colors.danger as string);
    return (
        <View style={[styles.statusDot, { backgroundColor: color }]} />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 24,
    },
    toggleBtn: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(15, 23, 42, 0.05)',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    listItem: {
        width: '100%',
    },
    gridItem: {
        flex: 1,
        marginHorizontal: 4,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginLeft: 10,
    },
});

export default FleetScreen;
