import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Switch, TouchableOpacity, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme/restyleTheme';
import Text from '../../components/atoms/Text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GlassCard from '../../components/GlassCard';
import Input from '../../components/atoms/Input';
import Button from '../../components/atoms/Button';
import { useSettingsStore, SessionTimeout } from '../../store/useSettingsStore';

const APP_VERSION = '1.0.0';
const BUILD_NUMBER = '2026.03.10';

const SESSION_TIMEOUT_OPTIONS: { label: string; value: SessionTimeout }[] = [
    { label: '15 min', value: 900000 },
    { label: '30 min', value: 1800000 },
    { label: '1 hour', value: 3600000 },
    { label: 'Never', value: 0 },
];

const CHART_REFRESH_OPTIONS = [
    { label: '500ms', value: 500 },
    { label: '1s', value: 1000 },
    { label: '2s', value: 2000 },
];

export function SettingsScreen() {
    const theme = useTheme<Theme>();
    const settings = useSettingsStore();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background as string }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text variant="heading">SETTINGS</Text>
                    <Text variant="caption">System Configuration</Text>
                </View>

                {/* Section 1: Connection */}
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <SectionTitle title="CONNECTION" icon="access-point-network" />
                    <GlassCard style={styles.card}>
                        <Input
                            label="WebSocket URL"
                            value={settings.wsUrl}
                            onChangeText={settings.setWsUrl}
                            placeholder="ws://..."
                        />
                        <View style={{ height: 16 }} />
                        <Input
                            label="MQTT Broker"
                            value={settings.mqttBroker}
                            onChangeText={settings.setMqttBroker}
                            placeholder="mqtt://..."
                        />
                        <Text variant="caption" style={styles.hint}>
                            Changes will trigger automatic reconnection.
                        </Text>
                    </GlassCard>
                </Animated.View>

                {/* Section 2: Notifications */}
                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <SectionTitle title="NOTIFICATIONS" icon="bell-ring-outline" />
                    <GlassCard style={styles.card}>
                        <SettingToggle
                            label="Battery Low Alert"
                            description="Notify when robot battery drops below 20%"
                            value={settings.batteryLowAlert}
                            onToggle={() => settings.toggleNotification('batteryLowAlert')}
                            icon="battery-low"
                            iconColor="#FF6B6B"
                        />
                        <Divider />
                        <SettingToggle
                            label="Obstacle Detected"
                            description="Alert when collision avoidance triggers"
                            value={settings.obstacleAlert}
                            onToggle={() => settings.toggleNotification('obstacleAlert')}
                            icon="shield-alert-outline"
                            iconColor="#FFA94D"
                        />
                        <Divider />
                        <SettingToggle
                            label="Sensor Failure"
                            description="Critical alerts for sensor malfunctions"
                            value={settings.sensorFailureAlert}
                            onToggle={() => settings.toggleNotification('sensorFailureAlert')}
                            icon="alert-octagon-outline"
                            iconColor="#FF6B6B"
                        />
                        <Divider />
                        <SettingToggle
                            label="Mission Complete"
                            description="Notify when a mission finishes successfully"
                            value={settings.missionCompleteAlert}
                            onToggle={() => settings.toggleNotification('missionCompleteAlert')}
                            icon="check-decagram-outline"
                            iconColor="#34D399"
                        />
                    </GlassCard>
                </Animated.View>

                {/* Section 3: Display */}
                <Animated.View entering={FadeInDown.delay(300).springify()}>
                    <SectionTitle title="DISPLAY" icon="palette-outline" />
                    <GlassCard style={styles.card}>
                        <SettingToggle
                            label="Dark Mode"
                            description="Toggle between dark and light themes"
                            value={settings.themeMode === 'dark'}
                            onToggle={(v) => settings.setThemeMode(v ? 'dark' : 'light')}
                            icon="brightness-6"
                            iconColor="#A78BFA"
                        />
                        <Divider />
                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <View style={[styles.iconBg, { backgroundColor: 'rgba(34, 211, 238, 0.15)' }]}>
                                    <MaterialCommunityIcons name="chart-timeline-variant" size={18} color="#22D3EE" />
                                </View>
                                <View>
                                    <Text variant="body">Chart Refresh Rate</Text>
                                    <Text variant="caption" style={styles.description}>Data update frequency for charts</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.segmentRow}>
                            {CHART_REFRESH_OPTIONS.map(opt => (
                                <TouchableOpacity
                                    key={opt.value}
                                    onPress={() => settings.setChartRefreshRate(opt.value)}
                                    style={[
                                        styles.segmentBtn,
                                        settings.chartRefreshRate === opt.value && { backgroundColor: theme.colors.primary as string }
                                    ]}
                                >
                                    <Text variant="caption" style={{
                                        fontWeight: '700',
                                        color: settings.chartRefreshRate === opt.value ? 'white' : theme.colors.textMuted as string,
                                    }}>
                                        {opt.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Divider />
                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <View style={[styles.iconBg, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
                                    <MaterialCommunityIcons name="map" size={18} color="#6366F1" />
                                </View>
                                <View>
                                    <Text variant="body">Map Style</Text>
                                    <Text variant="caption" style={styles.description}>Default map appearance</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.segmentRow}>
                            {(['satellite', 'standard', 'dark'] as const).map(style => (
                                <TouchableOpacity
                                    key={style}
                                    onPress={() => settings.setMapStyle(style)}
                                    style={[
                                        styles.segmentBtn,
                                        settings.mapStyle === style && { backgroundColor: theme.colors.primary as string }
                                    ]}
                                >
                                    <Text variant="caption" style={{
                                        fontWeight: '700',
                                        color: settings.mapStyle === style ? 'white' : theme.colors.textMuted as string,
                                    }}>
                                        {style.charAt(0).toUpperCase() + style.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </GlassCard>
                </Animated.View>

                {/* Section 4: Security */}
                <Animated.View entering={FadeInDown.delay(400).springify()}>
                    <SectionTitle title="SECURITY" icon="shield-lock-outline" />
                    <GlassCard style={styles.card}>
                        <SettingToggle
                            label="Biometric Lock"
                            description="Require authentication when returning to app"
                            value={settings.biometricLock}
                            onToggle={settings.setBiometricLock}
                            icon="fingerprint"
                            iconColor="#34D399"
                        />
                        <Divider />
                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <View style={[styles.iconBg, { backgroundColor: 'rgba(255, 169, 77, 0.15)' }]}>
                                    <MaterialCommunityIcons name="clock-outline" size={18} color="#FFA94D" />
                                </View>
                                <View>
                                    <Text variant="body">Session Timeout</Text>
                                    <Text variant="caption" style={styles.description}>Auto-lock after background time</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.segmentRow}>
                            {SESSION_TIMEOUT_OPTIONS.map(opt => (
                                <TouchableOpacity
                                    key={opt.value}
                                    onPress={() => settings.setSessionTimeout(opt.value)}
                                    style={[
                                        styles.segmentBtn,
                                        settings.sessionTimeout === opt.value && { backgroundColor: theme.colors.primary as string }
                                    ]}
                                >
                                    <Text variant="caption" style={{
                                        fontWeight: '700',
                                        color: settings.sessionTimeout === opt.value ? 'white' : theme.colors.textMuted as string,
                                    }}>
                                        {opt.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </GlassCard>
                </Animated.View>

                {/* Section 5: About */}
                <Animated.View entering={FadeInDown.delay(500).springify()}>
                    <SectionTitle title="ABOUT" icon="information-outline" />
                    <GlassCard style={styles.card}>
                        <InfoRow label="App Version" value={APP_VERSION} />
                        <Divider />
                        <InfoRow label="Build Number" value={BUILD_NUMBER} />
                        <Divider />
                        <InfoRow label="Platform" value={Platform.OS.toUpperCase()} />
                        <View style={{ height: 16 }} />
                        <Button variant="secondary" fullWidth>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <MaterialCommunityIcons name="stethoscope" size={18} color={theme.colors.primary as string} />
                                <Text variant="caption" style={{ color: theme.colors.primary as string, fontWeight: '700', marginLeft: 8 }}>
                                    RUN DIAGNOSTICS
                                </Text>
                            </View>
                        </Button>
                    </GlassCard>
                </Animated.View>

                {/* Danger Zone */}
                <Animated.View entering={FadeInDown.delay(600).springify()}>
                    <View style={styles.dangerZone}>
                        <Button variant="secondary" fullWidth style={{ marginBottom: 12 }}>
                            EXPORT LOG DATA
                        </Button>
                        <Button variant="danger" fullWidth>
                            FACTORY RESET SYSTEM
                        </Button>
                    </View>
                </Animated.View>

                <View style={{ height: 60 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

function SectionTitle({ title, icon }: { title: string; icon?: string }) {
    const theme = useTheme<Theme>();
    return (
        <View style={styles.sectionTitle}>
            {icon && <MaterialCommunityIcons name={icon as any} size={16} color={theme.colors.textMuted as string} style={{ marginRight: 8 }} />}
            <Text variant="caption" style={{ fontWeight: '700', letterSpacing: 1, opacity: 0.6 }}>{title}</Text>
        </View>
    );
}

function SettingToggle({ label, description, value, onToggle, icon, iconColor }: {
    label: string; description?: string; value: boolean;
    onToggle: (v: boolean) => void; icon: string; iconColor?: string;
}) {
    const theme = useTheme<Theme>();
    return (
        <View style={styles.toggleRow}>
            <View style={styles.settingInfo}>
                <View style={[styles.iconBg, { backgroundColor: (iconColor || theme.colors.primary) + '20' }]}>
                    <MaterialCommunityIcons name={icon as any} size={18} color={iconColor || theme.colors.primary as string} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text variant="body">{label}</Text>
                    {description && <Text variant="caption" style={styles.description}>{description}</Text>}
                </View>
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ true: theme.colors.primary as string, false: '#334155' }}
                thumbColor={value ? '#FFF' : '#94A3B8'}
            />
        </View>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.infoRow}>
            <Text variant="body">{label}</Text>
            <Text variant="mono" style={{ fontSize: 13, opacity: 0.8 }}>{value}</Text>
        </View>
    );
}

function Divider() {
    return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    header: {
        marginBottom: 32,
    },
    sectionTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        marginTop: 8,
    },
    card: {
        padding: 20,
        marginBottom: 24,
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 16,
    },
    settingRow: {
        paddingVertical: 12,
    },
    iconBg: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    description: {
        marginTop: 2,
        opacity: 0.5,
        fontSize: 11,
    },
    hint: {
        marginTop: 12,
        opacity: 0.5,
        fontStyle: 'italic',
    },
    segmentRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 4,
        marginBottom: 8,
        paddingLeft: 48, // align with text after icon
    },
    segmentBtn: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
    },
    dangerZone: {
        marginTop: 12,
    },
});

export default SettingsScreen;
