import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, SectionList, SafeAreaView, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeOutLeft } from 'react-native-reanimated';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme/restyleTheme';
import Text from '../../components/atoms/Text';
import { useAlertStore, Alert, AlertSeverity } from '../../store/useAlertStore';
import { AlertItem } from '../../components/notifications/AlertItem';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type FilterType = 'all' | AlertSeverity;

const SEVERITY_COLORS: Record<AlertSeverity, string> = {
    critical: '#FF6B6B',
    warning: '#FFA94D',
    info: '#22D3EE',
    success: '#34D399',
};

const SEVERITY_ICONS: Record<AlertSeverity, string> = {
    critical: 'alert-circle',
    warning: 'alert',
    info: 'information',
    success: 'check-circle',
};

export function AlertsScreen() {
    const theme = useTheme<Theme>();
    const { alerts, dismissAlert, markAsRead, markAllAsRead, clearAll } = useAlertStore();
    const [filter, setFilter] = useState<FilterType>('all');

    // Filter alerts
    const filteredAlerts = useMemo(() =>
        alerts.filter(a => filter === 'all' || a.severity === filter),
        [alerts, filter]
    );

    // Group into sections: Today, Yesterday, Earlier
    const sections = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today.getTime() - 86400000);

        const groups: Record<string, Alert[]> = {
            'Today': [],
            'Yesterday': [],
            'Earlier': [],
        };

        filteredAlerts.forEach(alert => {
            const alertDate = new Date(alert.timestamp);
            if (alertDate >= today) {
                groups['Today'].push(alert);
            } else if (alertDate >= yesterday) {
                groups['Yesterday'].push(alert);
            } else {
                groups['Earlier'].push(alert);
            }
        });

        return Object.entries(groups)
            .filter(([_, items]) => items.length > 0)
            .map(([title, data]) => ({ title, data }));
    }, [filteredAlerts]);

    const handleDismiss = useCallback((id: string) => {
        dismissAlert(id);
    }, [dismissAlert]);

    const handlePress = useCallback((alert: Alert) => {
        markAsRead(alert.id);
    }, [markAsRead]);

    const unreadCount = alerts.filter(a => !a.read).length;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background as string }]}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text variant="heading">ALERTS</Text>
                    <Text variant="caption">
                        {unreadCount > 0 ? `${unreadCount} unread notifications` : 'System Notifications'}
                    </Text>
                </View>
                <View style={styles.headerActions}>
                    {unreadCount > 0 && (
                        <TouchableOpacity onPress={markAllAsRead} style={styles.headerBtn}>
                            <Text variant="caption" style={{ color: theme.colors.primary as string, fontWeight: '700' }}>
                                MARK READ
                            </Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={clearAll} style={styles.headerBtn}>
                        <Text variant="caption" style={{ color: theme.colors.danger as string, fontWeight: '700' }}>
                            CLEAR ALL
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Filter Bar */}
            <View style={styles.filterBar}>
                <FilterTab label="All" count={alerts.length} active={filter === 'all'} onPress={() => setFilter('all')} />
                <FilterTab label="Critical" count={alerts.filter(a => a.severity === 'critical').length} active={filter === 'critical'} onPress={() => setFilter('critical')} color="#FF6B6B" />
                <FilterTab label="Warning" count={alerts.filter(a => a.severity === 'warning').length} active={filter === 'warning'} onPress={() => setFilter('warning')} color="#FFA94D" />
                <FilterTab label="Info" count={alerts.filter(a => a.severity === 'info').length} active={filter === 'info'} onPress={() => setFilter('info')} color="#22D3EE" />
            </View>

            {/* Date-grouped Alert List */}
            {sections.length > 0 ? (
                <SectionList
                    sections={sections}
                    keyExtractor={item => item.id}
                    renderSectionHeader={({ section: { title } }) => (
                        <View style={styles.sectionHeader}>
                            <Text variant="caption" style={styles.sectionTitle}>{title.toUpperCase()}</Text>
                        </View>
                    )}
                    renderItem={({ item }) => (
                        <AlertItem
                            alert={item}
                            onPress={() => handlePress(item)}
                            onDismiss={() => handleDismiss(item.id)}
                        />
                    )}
                    contentContainerStyle={styles.list}
                    stickySectionHeadersEnabled={false}
                />
            ) : (
                <View style={styles.emptyState}>
                    <MaterialCommunityIcons name="bell-off-outline" size={64} color={theme.colors.textMuted as string} />
                    <Text variant="subheading" style={{ marginTop: 16 }}>No alerts found</Text>
                    <Text variant="caption">Everything is running smoothly</Text>
                </View>
            )}
        </SafeAreaView>
    );
}


function FilterTab({ label, count, active, onPress, color }: {
    label: string; count: number; active: boolean; onPress: () => void; color?: string;
}) {
    const theme = useTheme<Theme>();
    const activeColor = color || (theme.colors.primary as string);
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.filterTab,
                active && { backgroundColor: activeColor, borderColor: activeColor }
            ]}
        >
            <Text
                variant="caption"
                style={{
                    fontWeight: '700',
                    color: active ? 'white' : theme.colors.textMuted as string
                }}
            >
                {label.toUpperCase()}
            </Text>
            {count > 0 && (
                <View style={[styles.countBadge, { backgroundColor: active ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)' }]}>
                    <Text variant="caption" style={{ fontSize: 10, fontWeight: '700', color: active ? 'white' : theme.colors.textMuted as string }}>
                        {count}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

function getTimeAgo(timestamp: Date): string {
    const now = Date.now();
    const diff = now - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
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
        paddingTop: 40,
        marginBottom: 20,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 12,
    },
    headerBtn: {
        paddingVertical: 8,
    },
    filterBar: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
        gap: 10,
    },
    filterTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        gap: 6,
    },
    countBadge: {
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        minWidth: 20,
        alignItems: 'center',
    },
    sectionHeader: {
        paddingVertical: 8,
        paddingHorizontal: 4,
        marginTop: 8,
    },
    sectionTitle: {
        fontWeight: '700',
        letterSpacing: 1.5,
        opacity: 0.5,
        fontSize: 11,
    },
    list: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    alertRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        marginBottom: 8,
    },
    alertRowUnread: {
        backgroundColor: 'rgba(99, 102, 241, 0.06)',
        borderLeftWidth: 3,
        borderLeftColor: 'rgba(99, 102, 241, 0.4)',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    alertContent: {
        flex: 1,
    },
    alertTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    alertTitle: {
        flex: 1,
        fontWeight: '500',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#6366F1',
        marginLeft: 8,
    },
    alertMeta: {
        flexDirection: 'row',
        marginTop: 6,
    },
    metaText: {
        fontSize: 11,
        opacity: 0.5,
    },
    dismissBtn: {
        padding: 4,
        marginLeft: 8,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.5,
    },
});

export default AlertsScreen;
