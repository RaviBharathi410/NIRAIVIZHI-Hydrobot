import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, GRADIENTS, SPACE, SHADOWS, SPRING } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import api from '../../services/api';
import { Alert } from 'react-native';

export default function MLSymptomsScreen({ navigation }) {
    const [symptoms, setSymptoms] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const predict = async () => {
        if (!symptoms.trim()) {
            return;
        }

        setLoading(true);
        setResult("");

        try {
            const res = await api.post("/predict", { symptoms });
            setResult(res.data.prediction || "No specific prediction returned.");
        } catch (error) {
            console.error("ML Prediction failed:", error);
            Alert.alert("Analysis Error", "Failed to connect to AI engine. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.title}>AI Diagnosis</Text>
                </View>

                <GlassCard style={styles.card} variant="heavy">
                    <View style={styles.iconCircle}>
                        <LinearGradient colors={GRADIENTS.primary} style={styles.iconGradient}>
                            <MaterialCommunityIcons name="brain" size={40} color={COLORS.white} />
                        </LinearGradient>
                    </View>
                    <Text style={styles.cardTitle}>Symptoms ML Reporter</Text>
                    <Text style={styles.cardSub}>Input patient symptoms for real-time predictive health screening.</Text>

                    <TextInput
                        placeholder="e.g., Patient reports severe stomach cramps and fever lasting 48 hours..."
                        style={styles.input}
                        placeholderTextColor={COLORS.textMuted}
                        multiline
                        numberOfLines={4}
                        onChangeText={setSymptoms}
                        value={symptoms}
                    />

                    <TouchableOpacity
                        style={[styles.button, !symptoms.trim() && styles.buttonDisabled]}
                        onPress={predict}
                        disabled={loading || !symptoms.trim()}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <LinearGradient
                                colors={!symptoms.trim() ? [COLORS.textMuted, COLORS.textMuted] : GRADIENTS.primary}
                                style={styles.buttonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <MaterialCommunityIcons name="lightning-bolt" size={20} color="white" style={{ marginRight: 8 }} />
                                <Text style={styles.buttonText}>Analyze with AI</Text>
                            </LinearGradient>
                        )}
                    </TouchableOpacity>
                </GlassCard>

                {result ? (
                    <GlassCard style={styles.resultCard} variant="elevated">
                        <View style={styles.resultHeader}>
                            <MaterialCommunityIcons name="shield-alert" size={24} color={COLORS.warning} />
                            <Text style={styles.resultTitle}>Analysis Result</Text>
                        </View>
                        <Text style={styles.resultText}>{result}</Text>
                    </GlassCard>
                ) : null}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    scrollContent: {
        padding: SPACE[6],
        paddingTop: 60,
        paddingBottom: 40
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32
    },
    backBtn: {
        marginRight: 16
    },
    title: {
        ...FONTS.extraBold,
        fontSize: 28,
        color: COLORS.text
    },
    card: {
        padding: 24,
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 16,
        ...SHADOWS.glow(COLORS.primary, 15, 0.3)
    },
    iconGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitle: {
        ...FONTS.bold,
        fontSize: 20,
        color: COLORS.text,
        marginBottom: 8
    },
    cardSub: {
        ...FONTS.medium,
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20
    },
    input: {
        width: '100%',
        backgroundColor: COLORS.surfaceLight,
        padding: 16,
        borderRadius: 14,
        ...FONTS.medium,
        fontSize: 16,
        color: COLORS.text,
        height: 120,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: COLORS.border
    },
    button: {
        width: '100%',
        marginTop: 20,
        borderRadius: 16,
        overflow: 'hidden',
    },
    buttonGradient: {
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDisabled: {
        opacity: 0.5
    },
    buttonText: {
        color: "white",
        ...FONTS.bold,
        fontSize: 16,
    },
    resultCard: {
        marginTop: 24,
        padding: 20,
        backgroundColor: COLORS.surface,
        borderColor: COLORS.warningSoft,
        borderWidth: 1,
        borderRadius: 20
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    resultTitle: {
        ...FONTS.bold,
        fontSize: 16,
        color: COLORS.warning,
        marginLeft: 10
    },
    resultText: {
        ...FONTS.medium,
        fontSize: 15,
        color: COLORS.textSecondary,
        lineHeight: 22,
    }
});
