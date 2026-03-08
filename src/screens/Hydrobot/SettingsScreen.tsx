import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch, SafeAreaView } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme/restyleTheme';
import Text from '../../components/atoms/Text';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export function SettingsScreen() {
    const theme = useTheme<Theme>();
    const [biometrics, setBiometrics] = useState(true);
    const [notifications, setNotifications] = useState(true);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background as string }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text variant="heading">Settings</Text>
                    <Text variant="caption">System Configuration</Text>
                </View>

                <Section title="Security">
                    <SettingItem
                        icon="fingerprint"
                        label="Biometric Login"
                        value={biometrics}
                        onToggle={setBiometrics}
                    />
                    <SettingItem
                        icon="shield-check-outline"
                        label="Two-Factor Auth"
                        value={false}
                        disabled
                    />
                </Section>

                <Section title="Notifications">
                    <SettingItem
                        icon="bell-outline"
                        label="Push Notifications"
                        value={notifications}
                        onToggle={setNotifications}
                    />
                    <SettingItem
                        icon="alert-octagon-outline"
                        label="Critical Alerts Only"
                        value={false}
                    />
                </Section>

                <Section title="Connectivity">
                    <View style={styles.infoRow}>
                        <MaterialCommunityIcons name="wifi" size={24} color={theme.colors.primary as string} />
                        <View style={{ marginLeft: 16, flex: 1 }}>
                            <Text variant="body" style={{ fontWeight: '600' }}>Bridge Status</Text>
                            <Text variant="caption">Connected to Local Base 01</Text>
                        </View>
                        <Text variant="caption" color="success" style={{ fontWeight: '700' }}>ONLINE</Text>
                    </View>
                </Section>

                <View style={styles.footer}>
                    <Text variant="caption" color="textMuted">Version 2.4.0-premium</Text>
                    <Text variant="caption" color="textMuted">© 2026 NIRAIVIZHI Systems</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <View style={styles.section}>
            <Text variant="caption" style={{ fontWeight: '700', marginBottom: 12, marginLeft: 4 }}>
                {title.toUpperCase()}
            </Text>
            <View style={styles.sectionCard}>
                {children}
            </View>
        </View>
    );
}

interface SettingItemProps {
    icon: string;
    label: string;
    value: boolean;
    onToggle?: (val: boolean) => void;
    disabled?: boolean;
}

function SettingItem({ icon, label, value, onToggle, disabled }: SettingItemProps) {
    const theme = useTheme<Theme>();
    return (
        <View style={[styles.item, disabled && { opacity: 0.5 }]}>
            <View style={styles.itemLeft}>
                <MaterialCommunityIcons name={icon as any} size={22} color={theme.colors.primary as string} />
                <Text variant="body" style={{ marginLeft: 12 }}>{label}</Text>
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ true: theme.colors.primary as string }}
                disabled={disabled}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    header: {
        paddingVertical: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(15, 23, 42, 0.05)',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(15, 23, 42, 0.03)',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(15, 23, 42, 0.05)',
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
    },
});

export default SettingsScreen;
