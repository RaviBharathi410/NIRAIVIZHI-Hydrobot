import React from 'react';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import HealthOfficialDashboard from '../screens/HealthOfficial/HealthOfficialDashboard';
import RegionalAnalyticsScreen from '../screens/HealthOfficial/RegionalAnalyticsScreen';
import DirectiveControlScreen from '../screens/HealthOfficial/DirectiveControlScreen';
import LogoutScreen from '../screens/Shared/LogoutScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import ContactScreen from '../screens/Shared/ContactScreen';
import JudgesFAQScreen from '../screens/Shared/JudgesFAQScreen';
import HeaderActions from '../components/HeaderActions';
import { COLORS, FONTS } from '../constants/theme';

export type HealthOfficialStackParamList = {
    HealthHome: undefined;
    RegionalAnalytics: undefined;
    DirectiveControl: undefined;
    Settings: undefined;
    Profile: undefined;
    Contact: undefined;
    JudgesFAQ: undefined;
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
    headerShown: false,
    headerRight: () => <HeaderActions />,
    contentStyle: { backgroundColor: COLORS.background },
};

export default function HealthOfficialStack() {
    return (
        <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
            <Stack.Screen name="HealthHome" component={HealthOfficialDashboard as any} options={{ title: 'Regional Hub' }} />
            <Stack.Screen name="RegionalAnalytics" component={RegionalAnalyticsScreen as any} options={{ title: 'Health Intelligence' }} />
            <Stack.Screen name="DirectiveControl" component={DirectiveControlScreen as any} options={{ title: 'Operational Control' }} />
            <Stack.Screen name="Settings" component={SettingsScreen as any} options={{ title: 'Settings' }} />
            <Stack.Screen name="Profile" component={ProfileScreen as any} options={{ title: 'Profile' }} />
            <Stack.Screen name="Contact" component={ContactScreen as any} options={{ title: 'Contact' }} />
            <Stack.Screen name="JudgesFAQ" component={JudgesFAQScreen as any} options={{ title: "FAQ" }} />
            <Stack.Screen name="Logout" component={LogoutScreen as any} options={{ title: 'Account', animation: 'slide_from_bottom' }} />
        </Stack.Navigator>
    );
}
