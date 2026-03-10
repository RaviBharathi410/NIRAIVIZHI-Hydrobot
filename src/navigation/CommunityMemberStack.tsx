import React from 'react';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import CommunityMemberDashboard from '../screens/CommunityMember/CommunityMemberDashboard';
import LogoutScreen from '../screens/Shared/LogoutScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import HeaderActions from '../components/HeaderActions';
import { COLORS, FONTS } from '../constants/theme';

export type CommunityMemberStackParamList = {
    CommunityHome: undefined;
    Settings: undefined;
    Logout: undefined;
};

const Stack = createNativeStackNavigator<CommunityMemberStackParamList>();

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

export default function CommunityMemberStack() {
    return (
        <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
            <Stack.Screen name="CommunityHome" component={CommunityMemberDashboard as any} options={{ title: 'Community Portal' }} />
            <Stack.Screen name="Settings" component={SettingsScreen as any} options={{ title: 'Settings' }} />
            <Stack.Screen name="Logout" component={LogoutScreen as any} options={{ title: 'Account', animation: 'slide_from_bottom' }} />
        </Stack.Navigator>
    );
}