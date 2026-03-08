import React from 'react';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import HealthOfficialDashboard from '../screens/HealthOfficial/HealthOfficialDashboard';
import LogoutScreen from '../screens/Shared/LogoutScreen';
import { COLORS, FONTS } from '../constants/theme';

export type HealthOfficialStackParamList = {
    HealthHome: undefined;
    Logout: undefined;
};

const Stack = createNativeStackNavigator<HealthOfficialStackParamList>();

const SCREEN_OPTIONS: NativeStackNavigationOptions = {
    animation: 'slide_from_right',
    headerTransparent: true,
    headerBlurEffect: 'light',
    headerTintColor: COLORS.text,
    headerTitleStyle: { ...FONTS.semiBold, fontSize: 18, color: COLORS.text } as any,
    headerShadowVisible: false,
    contentStyle: { backgroundColor: COLORS.background },
};

export default function HealthOfficialStack() {
    return (
        <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
            <Stack.Screen name="HealthHome" component={HealthOfficialDashboard as any} options={{ headerShown: false }} />
            <Stack.Screen name="Logout" component={LogoutScreen as any} options={{ title: 'Account', animation: 'slide_from_bottom' }} />
        </Stack.Navigator>
    );
}