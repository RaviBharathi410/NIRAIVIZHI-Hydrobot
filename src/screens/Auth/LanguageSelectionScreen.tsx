import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, SPACE } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import GlassCard from '../../components/GlassCard';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import storage from '../../utils/storage';

type LanguageIcon = keyof typeof MaterialCommunityIcons.glyphMap;

interface Language {
    id: string;
    name: string;
    sub: string;
    icon: LanguageIcon;
}

const LANGUAGES: Language[] = [
    { id: 'en', name: 'English', sub: 'Default', icon: 'alphabetical' },
    { id: 'hi', name: 'हिन्दी', sub: 'Hindi', icon: 'translate' },
    { id: 'ta', name: 'தமிழ்', sub: 'Tamil', icon: 'translate' },
    { id: 'te', name: 'తెలుగు', sub: 'Telugu', icon: 'translate' },
];

interface LanguageSelectionScreenProps {
    navigation: NativeStackNavigationProp<AuthStackParamList, 'LanguageSelection'>;
}

export default function LanguageSelectionScreen({ navigation }: LanguageSelectionScreenProps) {
    const { locale, changeLanguage } = useLanguage();

    const handleSelect = async (langId: string) => {
        changeLanguage(langId);
        await storage.set(storage.KEYS.INTRO_SEEN, 'true');
        setTimeout(() => navigation.navigate('UserPortal'), 400);
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={GRADIENTS.screen as any} style={StyleSheet.absoluteFill} />

            <View style={styles.content}>
                <MotiView
                    from={{ translateY: -20, opacity: 0 }}
                    animate={{ translateY: 0, opacity: 1 }}
                    transition={{ type: 'spring' } as any}
                >
                    <Text style={styles.title}>Welcome</Text>
                    <Text style={styles.subtitle}>Choose your preferred language</Text>
                </MotiView>

                <View style={styles.grid}>
                    {LANGUAGES.map((lang, i) => (
                        <MotiView
                            key={lang.id}
                            from={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', delay: 200 + i * 100 } as any}
                        >
                            <TouchableOpacity
                                onPress={() => handleSelect(lang.id)}
                                activeOpacity={0.8}
                            >
                                <GlassCard
                                    style={[
                                        styles.card,
                                        locale === lang.id && styles.selectedCard
                                    ]}
                                    variant={locale === lang.id ? 'elevated' : 'default'}
                                >
                                    <View style={[
                                        styles.iconCircle,
                                        { backgroundColor: locale === lang.id ? COLORS.accent + '20' : 'rgba(15, 23, 42, 0.05)' }
                                    ]}>
                                        <MaterialCommunityIcons
                                            name={lang.icon}
                                            size={24}
                                            color={locale === lang.id ? COLORS.accent : COLORS.textSecondary}
                                        />
                                    </View>
                                    <Text style={[
                                        styles.langName,
                                        { color: locale === lang.id ? COLORS.accent : COLORS.textSecondary }
                                    ]}>
                                        {lang.name}
                                    </Text>
                                    <Text style={styles.langSub}>{lang.sub}</Text>

                                    {locale === lang.id && (
                                        <MotiView
                                            from={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            style={styles.checkBadge as any}
                                        >
                                            <MaterialCommunityIcons name="check-circle" size={18} color={COLORS.accent} />
                                        </MotiView>
                                    )}
                                </GlassCard>
                            </TouchableOpacity>
                        </MotiView>
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        padding: SPACE[6],
        paddingTop: 80,
    },
    title: {
        ...FONTS.extraBold,
        fontSize: 32,
        color: COLORS.text,
    },
    subtitle: {
        ...FONTS.medium,
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: SPACE[8],
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: (Dimensions.get('window').width - 64) / 2,
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    selectedCard: {
        borderColor: COLORS.accent + '60',
        backgroundColor: COLORS.accent + '10',
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    langName: {
        ...FONTS.bold,
        fontSize: 18,
    },
    langSub: {
        ...FONTS.regular,
        fontSize: 12,
        color: COLORS.textMuted,
        marginTop: 2,
    },
    checkBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
    },
});