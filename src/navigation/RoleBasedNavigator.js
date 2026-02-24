import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import AppNavigator from './AppNavigator';
import { ActivityIndicator, View } from 'react-native';
import { COLORS } from '../constants/theme';

import { useFontsLoaded } from '../constants/fonts';

export default function RoleBasedNavigator() {
    const { user, isLoading: loading, isAuthenticated } = useAuth();
    const fontsLoaded = useFontsLoaded();

    if (loading || !fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
                <ActivityIndicator size="large" color={COLORS.accent} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {isAuthenticated ? <AppNavigator role={user?.role} /> : <AuthStack />}
        </NavigationContainer>
    );
}