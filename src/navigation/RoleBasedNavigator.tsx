import React from 'react';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import AppNavigator from './AppNavigator';
import { ActivityIndicator, View, Platform } from 'react-native';
import { COLORS } from '../constants/theme';

import { useFontsLoaded } from '../constants/fonts';

const navTheme: Theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: COLORS.background,
    },
};

export default function RoleBasedNavigator() {
    const { user, isLoading: loading, isAuthenticated } = useAuth();
    const fontsLoaded = useFontsLoaded();

    if (loading || !fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Platform.OS === 'web' ? 'transparent' : COLORS.background }}>
                <ActivityIndicator size="large" color={COLORS.accent} />
            </View>
        );
    }

    return (
        <NavigationContainer theme={navTheme}>
            {isAuthenticated ? <AppNavigator role={user?.role} /> : <AuthStack />}
        </NavigationContainer>
    );
}