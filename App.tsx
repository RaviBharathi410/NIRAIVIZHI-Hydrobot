import 'react-native-gesture-handler';
import React from 'react';
import './src/index.css';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { LanguageProvider } from './src/context/LanguageContext';
import { AuthProvider } from './src/context/AuthContext';
import { RoleProvider } from './src/context/RoleContext';
import RoleBasedNavigator from './src/navigation/RoleBasedNavigator';
import { useFontsLoaded } from './src/constants/fonts';
import { COLORS } from './src/constants/theme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initNetworkBypass } from './src/services/networkBypass';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@shopify/restyle';
import theme from './src/constants/restyleTheme';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/components/notifications/ToastConfig';

// Initialize network bypass for port 3001 mitigation
initNetworkBypass();

import { socketService } from './src/services/socketService';
socketService.connect();

// Suppress common deprecation warnings on web which are often triggered by libraries
if (Platform.OS === 'web') {
    const originalWarn = console.warn;
    console.warn = (...args) => {
        if (args[0] && typeof args[0] === 'string') {
            const msg = args[0];
            if (msg.includes('useNativeDriver') ||
                msg.includes('resizeMode') ||
                msg.includes('pointerEvents') ||
                msg.includes("FlashList's rendered size is not usable")) {
                return;
            }
        }
        originalWarn(...args);
    };
}

export default function App() {
    const fontsLoaded = useFontsLoaded();

    if (!fontsLoaded) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <View style={styles.container}>
                <StatusBar style="dark" translucent />
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <LanguageProvider>
                        <AuthProvider>
                            <RoleProvider>
                                <RoleBasedNavigator />
                            </RoleProvider>
                        </AuthProvider>
                    </LanguageProvider>
                </GestureHandlerRootView>
            </View>
            <Toast config={toastConfig} />
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loading: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
});