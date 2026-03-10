import React from 'react';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import HydrobotNavigator from './HydrobotNavigator';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import { SettingsScreen as HydrobotSettingsScreen } from '../screens/Hydrobot/SettingsScreen';
import { FleetManagementScreen } from '../screens/Hydrobot/FleetManagementScreen';
import LogoutScreen from '../screens/Shared/LogoutScreen';
import HeaderActions from '../components/HeaderActions';
import { COLORS, FONTS } from '../constants/theme';

export type HydrobotStackParamList = {
    HydrobotTabs: undefined;
    Settings: undefined;
    HydrobotSettings: undefined;
    FleetManagement: undefined;
    Logout: undefined;
};

const Stack = createNativeStackNavigator<HydrobotStackParamList>();

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

export default function HydrobotStack() {
    return (
        <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
            <Stack.Screen
                name="HydrobotTabs"
                component={HydrobotNavigator as any}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Settings"
                component={SettingsScreen as any}
                options={{ title: 'Settings', headerShown: true }}
            />
            <Stack.Screen
                name="HydrobotSettings"
                component={HydrobotSettingsScreen as any}
                options={{ title: 'Robot Settings', headerShown: true }}
            />
            <Stack.Screen
                name="FleetManagement"
                component={FleetManagementScreen as any}
                options={{ title: 'Fleet Management', headerShown: true }}
            />
            <Stack.Screen
                name="Logout"
                component={LogoutScreen as any}
                options={{ title: 'Account', animation: 'slide_from_bottom' }}
            />
        </Stack.Navigator>
    );
}
