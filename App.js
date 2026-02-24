import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { LanguageProvider } from './src/context/LanguageContext';
import { AuthProvider } from './src/context/AuthContext';
import { RoleProvider } from './src/context/RoleContext';
import RoleBasedNavigator from './src/navigation/RoleBasedNavigator';
import { useFontsLoaded } from './src/constants/fonts';
import { COLORS } from './src/constants/theme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initNetworkBypass } from './src/services/networkBypass';

// Initialize network bypass for port 3001 mitigation
initNetworkBypass();

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
        <View style={styles.container}>
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