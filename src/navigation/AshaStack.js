import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ASHAWorkerDashboard from '../screens/Asha/ASHAWorkerDashboard';
import WaterTestForm from '../screens/Asha/WaterTestForm';
import PatientVisitsList from '../screens/Asha/PatientVisitsList';
import SymptomTrendsScreen from '../screens/Asha/SymptomTrendsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import PatientEntryScreen from '../screens/Patient/PatientEntryScreen';
import MLSymptomsScreen from '../screens/ML/MLSymptomsScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import GenerateReportScreen from '../screens/Asha/GenerateReportScreen';
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

export default function AshaStack() {
    return (
        <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
            <Stack.Screen name="ASHAHome" component={ASHAWorkerDashboard} options={{ headerShown: false }} />
            <Stack.Screen name="WaterTestForm" component={WaterTestForm} options={{ title: 'Water Test' }} />
            <Stack.Screen name="PatientVisitsList" component={PatientVisitsList} options={{ title: 'Patient Visits' }} />
            <Stack.Screen name="SymptomTrends" component={SymptomTrendsScreen} options={{ title: 'Symptom Trends' }} />
            <Stack.Screen name="GenerateReport" component={GenerateReportScreen} options={{ title: 'Generate Report' }} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
            <Stack.Screen name="PatientEntry" component={PatientEntryScreen} options={{ title: 'Patient Entry' }} />
            <Stack.Screen name="MLSymptoms" component={MLSymptomsScreen} options={{ title: 'AI Diagnosis' }} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
            <Stack.Screen name="Logout" component={LogoutScreen} options={{ title: 'Account', animation: 'slide_from_bottom' }} />
        </Stack.Navigator>
    );
}