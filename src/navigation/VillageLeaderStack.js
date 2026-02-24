import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VillageLeaderDashboard from '../screens/VillageLeader/VillageLeaderDashboard';
import LogoutScreen from '../screens/Shared/LogoutScreen';
import { COLORS, FONTS } from '../constants/theme';

const Stack = createNativeStackNavigator();

const SCREEN_OPTIONS = {
    animation: 'slide_from_right',
    headerTransparent: true,
    headerBlurEffect: 'dark',
    headerTintColor: COLORS.white,
    headerTitleStyle: { ...FONTS.semiBold, fontSize: 18, color: COLORS.white },
    headerShadowVisible: false,
    contentStyle: { backgroundColor: COLORS.background },
};

export default function VillageLeaderStack() {
    return (
        <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
            <Stack.Screen name="VillageHome" component={VillageLeaderDashboard} options={{ headerShown: false }} />
            <Stack.Screen name="Logout" component={LogoutScreen} options={{ title: 'Account', animation: 'slide_from_bottom' }} />
        </Stack.Navigator>
    );
}