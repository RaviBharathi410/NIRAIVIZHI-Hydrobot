import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/Auth/SplashScreen';
import LanguageSelectionScreen from '../screens/Auth/LanguageSelectionScreen';
import UserPortalScreen from '../screens/Auth/UserPortalScreen';
import LoginModal from '../screens/Auth/LoginModal';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
            <Stack.Screen name="UserPortal" component={UserPortalScreen} />
            <Stack.Screen name="Login" component={LoginModal} options={{ presentation: 'modal' }} />
        </Stack.Navigator>
    );
}