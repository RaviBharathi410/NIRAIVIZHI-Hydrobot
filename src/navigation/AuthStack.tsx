import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../constants/theme';
import IntroScreenX from '../screens/Auth/IntroScreenX';
import LanguageSelectionScreen from '../screens/Auth/LanguageSelectionScreen';
import UserPortalScreen from '../screens/Auth/UserPortalScreen';
import LoginModal from '../screens/Auth/LoginModal';

export type AuthStackParamList = {
    Splash: undefined;
    LanguageSelection: undefined;
    UserPortal: undefined;
    Login: { role: string };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: COLORS.background }
        }}>
            <Stack.Screen name="Splash" component={IntroScreenX as any} />
            <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen as any} />
            <Stack.Screen name="UserPortal" component={UserPortalScreen as any} />
            <Stack.Screen name="Login" component={LoginModal as any} options={{ presentation: 'modal' }} />
        </Stack.Navigator>
    );
}