import React from 'react';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import VillageLeaderDashboard from '../screens/VillageLeader/VillageLeaderDashboard';
import LogoutScreen from '../screens/Shared/LogoutScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import HeaderActions from '../components/HeaderActions';
import { COLORS, FONTS } from '../constants/theme';

export type VillageLeaderStackParamList = {
    VillageHome: undefined;
    Settings: undefined;
    Logout: undefined;
};

const Stack = createNativeStackNavigator<VillageLeaderStackParamList>();

const SCREEN_OPTIONS: NativeStackNavigationOptions = {
    animation: 'slide_from_right',
    headerTransparent: true,
    headerBlurEffect: 'light',
    headerTintColor: COLORS.text,
    headerTitleStyle: { ...FONTS.semiBold, fontSize: 18, color: COLORS.text } as any,
    headerShadowVisible: false,
    headerShown: false,
    headerRight: () => <HeaderActions />,
    contentStyle: { backgroundColor: COLORS.background },
};

export default function VillageLeaderStack() {
    return (
        <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
            <Stack.Screen name="VillageHome" component={VillageLeaderDashboard as any} options={{ title: 'Village Board' }} />
            <Stack.Screen name="Settings" component={SettingsScreen as any} options={{ title: 'Settings' }} />
            <Stack.Screen name="Logout" component={LogoutScreen as any} options={{ title: 'Account', animation: 'slide_from_bottom' }} />
        </Stack.Navigator>
    );
}