import React from 'react';
import { View, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme/restyleTheme';
import Text from '../../components/atoms/Text';
import { AlertItem } from '../../components/notifications/AlertItem';

interface Alert {
    id: string;
    type: 'critical' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: Date;
    isRead: boolean;
}

export function AlertsScreen() {
    const theme = useTheme<Theme>();

    const alerts: Alert[] = [
        {
            id: '1',
            type: 'critical',
            title: 'Critical Pollution Detected',
            message: 'pH levels dropped significantly in Sector A drain. Action required.',
            timestamp: new Date(),
            isRead: false,
        },
        {
            id: '2',
            type: 'warning',
            title: 'Low Battery Alert',
            message: 'HY-BOT-02 battery is critically low (12%). Returning to base.',
            timestamp: new Date(Date.now() - 1800000),
            isRead: false,
        },
        {
            id: '3',
            type: 'info',
            title: 'Mission Complete',
            message: 'HY-BOT-01 completed the survey of Sector B.',
            timestamp: new Date(Date.now() - 7200000),
            isRead: true,
        },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background as string }]}>
            <FlatList
                data={alerts}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={() => (
                    <View style={styles.header}>
                        <Text variant="heading">Alert Center</Text>
                        <Text variant="caption" style={{ marginTop: 4 }}>System intelligence and maintenance</Text>
                    </View>
                )}
                renderItem={({ item }) => (
                    <AlertItem
                        alert={item as any}
                        onPress={() => { }}
                        onDismiss={() => { }}
                    />
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    header: {
        paddingVertical: 24,
    },
});

export default AlertsScreen;
