import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, GRADIENTS, SPACE, SHADOWS, SPRING } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';
import api from '../../services/api';
import { Alert, ActivityIndicator } from 'react-native';

export default function PatientEntryScreen({ navigation }) {
    const [patient, setPatient] = useState({
        name: "",
        age: "",
        symptoms: ""
    });
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!patient.name || !patient.age) {
            Alert.alert("Missing Info", "Please provide at least Name and Age.");
            return;
        }

        setLoading(true);
        try {
            await api.post("/patients", patient);
            Alert.alert("Success", "Patient record saved successfully.", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error("Patient save failed:", error);
            Alert.alert("Save Failed", "Could not save patient record. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <LinearGradient colors={GRADIENTS.screen} style={StyleSheet.absoluteFill} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Patient Entry</Text>
                </View>

                <GlassCard style={styles.formCard} variant="heavy">
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Patient Name</Text>
                        <TextInput
                            placeholder="Full Name"
                            style={styles.input}
                            placeholderTextColor={COLORS.textMuted}
                            value={patient.name}
                            onChangeText={(text) =>
                                setPatient({ ...patient, name: text })
                            }
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Age</Text>
                        <TextInput
                            placeholder="Years"
                            style={styles.input}
                            placeholderTextColor={COLORS.textMuted}
                            keyboardType="numeric"
                            value={patient.age}
                            onChangeText={(text) =>
                                setPatient({ ...patient, age: text })
                            }
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Reported Symptoms</Text>
                        <TextInput
                            placeholder="Describe symptoms..."
                            style={[styles.input, styles.textArea]}
                            placeholderTextColor={COLORS.textMuted}
                            multiline
                            numberOfLines={4}
                            value={patient.symptoms}
                            onChangeText={(text) =>
                                setPatient({ ...patient, symptoms: text })
                            }
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSave}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={GRADIENTS.accent}
                            style={styles.buttonGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <MaterialCommunityIcons name="content-save-outline" size={20} color="white" style={{ marginRight: 8 }} />
                            <Text style={styles.buttonText}>Register Patient</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </GlassCard>
            </ScrollView>
        </KeyboardAvoidingView>
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
    formCard: {
        padding: 24,
        backgroundColor: COLORS.surface,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    inputGroup: {
        marginBottom: 20
    },
    label: {
        ...FONTS.bold,
        fontSize: 13,
        color: COLORS.textMuted,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    input: {
        backgroundColor: COLORS.surfaceLight,
        padding: 16,
        borderRadius: 14,
        ...FONTS.medium,
        fontSize: 16,
        color: COLORS.text,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top'
    },
    button: {
        marginTop: 10,
        borderRadius: 16,
        overflow: 'hidden',
        ...SHADOWS.glow(COLORS.accent, 15, 0.3)
    },
    buttonGradient: {
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: "white",
        ...FONTS.bold,
        fontSize: 16,
    }
});
