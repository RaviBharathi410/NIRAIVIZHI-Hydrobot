import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CommunityMemberDashboard from '../screens/CommunityMember/CommunityMemberDashboard';
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

export default function CommunityMemberStack() {
    return (
        <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
            <Stack.Screen name="CommunityHome" component={CommunityMemberDashboard} options={{ headerShown: false }} />
            <Stack.Screen name="Logout" component={LogoutScreen} options={{ title: 'Account', animation: 'slide_from_bottom' }} />
        </Stack.Navigator>
    );
}