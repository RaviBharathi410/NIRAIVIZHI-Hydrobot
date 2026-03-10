import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    FadeInDown,
    ZoomIn,
    FadeInUp,
    FadeInRight,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    withDelay
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, SPACE, SHADOWS } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import SectionHeader from '../../components/SectionHeader';
import ScreenHeader from '../../components/ScreenHeader';
import AnimatedButton from '../../components/AnimatedButton';
import Input from '../../components/atoms/Input';

const ACTIVE_DIRECTIVES = [
    { id: '1', title: 'Water Boil Protocol v2', status: 'ACTIVE', reach: '8.4k', target: '10k', sync: '92%' },
    { id: '2', title: 'Lane 2B Exclusion Zone', status: 'DRAFT', reach: '0', target: '1.2k', sync: '0%' },
];

const DirectiveProgress = ({ sync, delay }: { sync: string, delay: number }) => {
    const width = useSharedValue(0);
    const targetWidth = parseFloat(sync);

    useEffect(() => {
        width.value = withDelay(delay, withTiming(targetWidth, { duration: 1000 }));
    }, [targetWidth]);

    const animatedStyle = useAnimatedStyle(() => ({
        width: `${width.value}%`,
    }));

    return (
        <View style={styles.progressBarBg}>
            <Animated.View style={[styles.progressBarFill, animatedStyle]} />
        </View>
    );
};

export default function DirectiveControlScreen() {
    const [broadcasting, setBroadcasting] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleBroadcast = () => {
        setBroadcasting(true);
        setTimeout(() => setBroadcasting(false), 2000);
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <ScreenHeader
                        title="Operational Control"
                        subtitle="Regional Health Directive Management"
                        showBack={true}
                    />
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <GlassCard style={styles.composerCard} variant="heavy">
                        <SectionHeader title="Broadcast New Directive" />
                        <Input
                            label="DIRECTIVE TITLE"
                            placeholder="e.g. Sector 4 Precautionary Alert"
                            value={title}
                            onChangeText={setTitle}
                        />
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>DIRECTIVE CONTENT</Text>
                            <View style={styles.textAreaWrapper}>
                                <TextInput
                                    placeholder="Enter clinical instructions or public health notices..."
                                    style={styles.textArea}
                                    placeholderTextColor={COLORS.textMuted}
                                    multiline
                                    numberOfLines={4}
                                    value={content}
                                    onChangeText={setContent}
                                />
                            </View>
                        </View>
                        <AnimatedButton
                            title="Execute Regional Broadcast"
                            variant="primary"
                            iconRight="broadcast"
                            loading={broadcasting}
                            onPress={handleBroadcast}
                            style={{ marginTop: 12 }}
                        />
                    </GlassCard>
                </Animated.View>

                <SectionHeader title="Transmission Status" />
                <View style={styles.directiveList}>
                    {ACTIVE_DIRECTIVES.map((dir, i) => (
                        <Animated.View
                            key={dir.id}
                            entering={FadeInDown.delay(300 + i * 100).springify()}
                        >
                            <GlassCard style={styles.dirCard} variant="elevated">
                                <View style={styles.dirHeader}>
                                    <View style={styles.dirTitleBox}>
                                        <Text style={styles.dirTitle}>{dir.title}</Text>
                                        <View style={[
                                            styles.statusBadge,
                                            { backgroundColor: dir.status === 'ACTIVE' ? COLORS.success + '20' : COLORS.textMuted + '20' }
                                        ]}>
                                            <Text style={[
                                                styles.statusText,
                                                { color: dir.status === 'ACTIVE' ? COLORS.success : COLORS.textMuted }
                                            ]}>
                                                {dir.status}
                                            </Text>
                                        </View>
                                    </View>
                                    <MaterialCommunityIcons
                                        name={dir.status === 'ACTIVE' ? "radio-tower" : "file-edit-outline"}
                                        size={20}
                                        color={dir.status === 'ACTIVE' ? COLORS.primary : COLORS.textMuted}
                                    />
                                </View>

                                <View style={styles.progressSection}>
                                    <View style={styles.progressInfo}>
                                        <Text style={styles.progLabel}>REACH: {dir.reach} / {dir.target} households</Text>
                                        <Text style={styles.progVal}>{dir.sync}</Text>
                                    </View>
                                    <DirectiveProgress sync={dir.sync} delay={500 + i * 100} />
                                </View>

                                <View style={styles.dirActions}>
                                    <TouchableOpacity style={styles.dirActionBtn}>
                                        <MaterialCommunityIcons name="eye-outline" size={18} color={COLORS.primary} />
                                        <Text style={styles.dirActionText}>View Details</Text>
                                    </TouchableOpacity>
                                    <View style={styles.divider} />
                                    <TouchableOpacity style={styles.dirActionBtn}>
                                        <MaterialCommunityIcons name="stop-circle-outline" size={18} color={COLORS.danger} />
                                        <Text style={[styles.dirActionText, { color: COLORS.danger }]}>Terminate</Text>
                                    </TouchableOpacity>
                                </View>
                            </GlassCard>
                        </Animated.View>
                    ))}
                </View>

                <Animated.View entering={FadeInUp.delay(600)} style={styles.securityBox}>
                    <MaterialCommunityIcons name="shield-lock-outline" size={20} color={COLORS.textMuted} />
                    <Text style={styles.securityText}>
                        Directives require 256-bit encryption before regional distribution. Authorized personnel only.
                    </Text>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scrollContent: { padding: SPACE[6], paddingTop: 60, paddingBottom: 60 },
    composerCard: { padding: 24, borderRadius: 24, marginBottom: 24 },
    inputGroup: { marginBottom: 20 },
    label: { ...FONTS.bold, fontSize: 13, color: COLORS.textMuted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
    textAreaWrapper: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        paddingHorizontal: 12,
        height: 120,
    },
    textArea: {
        flex: 1,
        color: COLORS.text,
        ...FONTS.medium,
        fontSize: 16,
        textAlignVertical: 'top',
        paddingTop: 12
    },
    directiveList: { gap: 16, marginBottom: 24 },
    dirCard: { padding: 20, borderRadius: 22 },
    dirHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
    dirTitleBox: { flex: 1, marginRight: 12 },
    dirTitle: { ...FONTS.bold, fontSize: 17, color: COLORS.text, marginBottom: 6 },
    statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    statusText: { ...FONTS.bold, fontSize: 9, letterSpacing: 1 },
    progressSection: { marginBottom: 20 },
    progressInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    progLabel: { ...FONTS.medium, fontSize: 11, color: COLORS.textMuted },
    progVal: { ...FONTS.bold, fontSize: 12, color: COLORS.primary },
    progressBarBg: { height: 6, backgroundColor: COLORS.surfaceLight, borderRadius: 3, overflow: 'hidden' },
    progressBarFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },
    dirActions: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, overflow: 'hidden' },
    dirActionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 8 },
    dirActionText: { ...FONTS.bold, fontSize: 13, color: COLORS.primary },
    divider: { width: 1, height: 20, backgroundColor: COLORS.border },
    securityBox: { flexDirection: 'row', alignItems: 'center', padding: 20, opacity: 0.6, gap: 12 },
    securityText: { ...FONTS.medium, fontSize: 11, color: COLORS.textMuted, flex: 1, lineHeight: 16 },
});

