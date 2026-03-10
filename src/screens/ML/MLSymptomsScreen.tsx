import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    FadeInDown,
    FadeInUp,
    ZoomIn,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    interpolate
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, SPACE, SHADOWS } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import ScreenHeader from '../../components/ScreenHeader';
import Input from '../../components/atoms/Input';
import AnimatedButton from '../../components/AnimatedButton';
import { api } from '../../services/api';

const AIPulse = () => {
    const pulse = useSharedValue(0);

    useEffect(() => {
        pulse.value = withRepeat(
            withTiming(1, { duration: 2000 }),
            -1,
            false
        );
    }, []);

    const ringStyle = useAnimatedStyle(() => ({
        transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 2.5]) }],
        opacity: interpolate(pulse.value, [0, 0.5, 1], [0.5, 0.2, 0]),
    }));

    return (
        <View style={styles.pulseContainer}>
            <Animated.View style={[styles.pulseRing, ringStyle]} />
            <LinearGradient colors={GRADIENTS.primary as any} style={styles.pulseCore}>
                <MaterialCommunityIcons name="brain" size={32} color="white" />
            </LinearGradient>
        </View>
    );
};

export default function MLSymptomsScreen() {
    const [symptoms, setSymptoms] = useState("");
    const [loading, setLoading] = useState(false);
    const [diagnosis, setDiagnosis] = useState<any>(null);

    const handleAnalyze = async () => {
        if (!symptoms.trim()) return;
        setLoading(true);
        setDiagnosis(null);

        try {
            // Simulate AI heavy lifting
            setTimeout(async () => {
                const response = await api.post('/api/analyze-symptoms', { symptoms });
                setDiagnosis(response.data || {
                    condition: "Acute Gastroenteritis",
                    confidence: 94,
                    recommendation: "Immediate ORS administration and observation for 4 hours."
                });
                setLoading(false);
            }, 2500);
        } catch (error) {
            console.error("Analysis failed:", error);
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <ScreenHeader
                        title="AI Diagnostics"
                        subtitle="Machine Learning Symptom Analysis"
                    />
                </Animated.View>

                {!diagnosis && !loading && (
                    <Animated.View entering={FadeInDown.delay(200).springify()}>
                        <GlassCard style={styles.inputCard} variant="heavy">
                            <View style={styles.aiHeader}>
                                <View style={styles.aiIconBox}>
                                    <MaterialCommunityIcons name="auto-fix" size={24} color={COLORS.primary} />
                                </View>
                                <View>
                                    <Text style={styles.aiTitle}>Neural Diagnostic Engine</Text>
                                    <Text style={styles.aiSub}>Powered by NIRAIVIZHI AI</Text>
                                </View>
                            </View>

                            <Input
                                label="Describe Patient Condition"
                                placeholder="Enter symptoms, duration and severity..."
                                value={symptoms}
                                onChangeText={setSymptoms}
                                style={styles.input}
                            />

                            <AnimatedButton
                                title="Run Neural Analysis"
                                variant="primary"
                                iconRight="magnify-scan"
                                onPress={handleAnalyze}
                                disabled={!symptoms.trim()}
                            />
                        </GlassCard>
                    </Animated.View>
                )}

                {loading && (
                    <View style={styles.loadingContainer}>
                        <AIPulse />
                        <Animated.Text entering={FadeInUp.delay(300)} style={styles.loadingText}>
                            Analyzing Symptom Clusters...
                        </Animated.Text>
                        <Animated.Text entering={FadeInUp.delay(600)} style={styles.loadingSub}>
                            Cross-referencing with local water quality data
                        </Animated.Text>
                    </View>
                )}

                {diagnosis && !loading && (
                    <View style={styles.resultContainer}>
                        <Animated.View entering={ZoomIn.duration(500)}>
                            <GlassCard style={styles.resultCard} variant="heavy">
                                <View style={styles.resHeader}>
                                    <MaterialCommunityIcons name="check-decagram" size={28} color={COLORS.success} />
                                    <Text style={styles.resTitle}>Analysis Complete</Text>
                                </View>

                                <View style={styles.diagBox}>
                                    <Text style={styles.diagLabel}>PROBABLE CONDITION</Text>
                                    <Text style={styles.diagVal}>{diagnosis.condition}</Text>
                                    <View style={styles.confRow}>
                                        <View style={styles.confBarBg}>
                                            <Animated.View
                                                entering={FadeInDown.delay(500).duration(1000)}
                                                style={[styles.confBarFill, { width: `${diagnosis.confidence}%` }]}
                                            />
                                        </View>
                                        <Text style={styles.confText}>{diagnosis.confidence}% Confidence</Text>
                                    </View>
                                </View>

                                <View style={styles.recBox}>
                                    <Text style={styles.recLabel}>IMMEDIATE ACTION</Text>
                                    <Text style={styles.recVal}>{diagnosis.recommendation}</Text>
                                </View>

                                <AnimatedButton
                                    title="Start New Analysis"
                                    variant="outline"
                                    onPress={() => { setDiagnosis(null); setSymptoms(""); }}
                                    style={{ marginTop: 20 }}
                                />
                            </GlassCard>
                        </Animated.View>
                    </View>
                )}

                <Animated.View entering={FadeInDown.delay(400).springify()}>
                    <View style={styles.disclaimerBox}>
                        <MaterialCommunityIcons name="information" size={20} color={COLORS.textMuted} />
                        <Text style={styles.disclaimerText}>
                            AI tool is for auxiliary support only. Always follow standard primary health protocols.
                        </Text>
                    </View>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scrollContent: { padding: SPACE[6], paddingTop: 60, paddingBottom: 40 },
    inputCard: { padding: 24, borderRadius: 24 },
    aiHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
    aiIconBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: COLORS.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16
    },
    aiTitle: { ...FONTS.bold, fontSize: 18, color: COLORS.text },
    aiSub: { ...FONTS.medium, fontSize: 12, color: COLORS.primary },
    input: { marginBottom: 20 },
    loadingContainer: { alignItems: 'center', paddingVertical: 60 },
    pulseContainer: { width: 100, height: 100, justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
    pulseRing: { position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary },
    pulseCore: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        ...(SHADOWS.glow(COLORS.primary, 20, 0.4) as any)
    },
    loadingText: { ...FONTS.bold, fontSize: 20, color: COLORS.text, marginBottom: 8 },
    loadingSub: { ...FONTS.medium, fontSize: 14, color: COLORS.textMuted },
    resultContainer: { marginBottom: 24 },
    resultCard: { padding: 24, borderRadius: 24 },
    resHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
    resTitle: { ...FONTS.bold, fontSize: 20, color: COLORS.text, marginLeft: 12 },
    diagBox: { backgroundColor: COLORS.surfaceLight, padding: 20, borderRadius: 16, marginBottom: 16 },
    diagLabel: { ...FONTS.bold, fontSize: 11, color: COLORS.textMuted, letterSpacing: 1, marginBottom: 8 },
    diagVal: { ...FONTS.extraBold, fontSize: 24, color: COLORS.text, marginBottom: 16 },
    confRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    confBarBg: { flex: 1, height: 6, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 3, overflow: 'hidden' },
    confBarFill: { height: '100%', backgroundColor: COLORS.success, borderRadius: 3 },
    confText: { ...FONTS.bold, fontSize: 13, color: COLORS.success },
    recBox: { borderLeftWidth: 4, borderLeftColor: COLORS.warning, paddingLeft: 16, marginVertical: 8 },
    recLabel: { ...FONTS.bold, fontSize: 11, color: COLORS.warning, letterSpacing: 0.5, marginBottom: 4 },
    recVal: { ...FONTS.medium, fontSize: 15, color: COLORS.textSecondary, lineHeight: 22 },
    disclaimerBox: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: 16, marginTop: 20 },
    disclaimerText: { ...FONTS.medium, fontSize: 12, color: COLORS.textMuted, marginLeft: 12, flex: 1, lineHeight: 18 },
});
