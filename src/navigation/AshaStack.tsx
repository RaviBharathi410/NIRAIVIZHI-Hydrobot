import React from 'react';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
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

export type AshaStackParamList = {
    ASHAHome: undefined;
    WaterTestForm: undefined;
    PatientVisitsList: undefined;
    SymptomTrends: undefined;
    GenerateReport: undefined;
    Profile: undefined;
    PatientEntry: undefined;
    MLSymptoms: undefined;
    Settings: undefined;
    Logout: undefined;
};

const Stack = createNativeStackNavigator<AshaStackParamList>();

const SCREEN_OPTIONS: NativeStackNavigationOptions = {
    animation: 'slide_from_right',
    headerTransparent: true,
    headerBlurEffect: 'light',
    headerTintColor: COLORS.text,
    headerTitleStyle: { ...FONTS.semiBold, fontSize: 18, color: COLORS.text } as any,
    headerShadowVisible: false,
    contentStyle: { backgroundColor: COLORS.background },
};

export default function AshaStack() {
    return (
        <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
            <Stack.Screen name="ASHAHome" component={ASHAWorkerDashboard as any} options={{ headerShown: false }} />
            <Stack.Screen name="WaterTestForm" component={WaterTestForm as any} options={{ title: 'Water Test' }} />
            <Stack.Screen name="PatientVisitsList" component={PatientVisitsList as any} options={{ title: 'Patient Visits' }} />
            <Stack.Screen name="SymptomTrends" component={SymptomTrendsScreen as any} options={{ title: 'Symptom Trends' }} />
            <Stack.Screen name="GenerateReport" component={GenerateReportScreen as any} options={{ title: 'Generate Report' }} />
            <Stack.Screen name="Profile" component={ProfileScreen as any} options={{ title: 'Profile' }} />
            <Stack.Screen name="PatientEntry" component={PatientEntryScreen as any} options={{ title: 'Patient Entry' }} />
            <Stack.Screen name="MLSymptoms" component={MLSymptomsScreen as any} options={{ title: 'AI Diagnosis' }} />
            <Stack.Screen name="Settings" component={SettingsScreen as any} options={{ title: 'Settings' }} />
            <Stack.Screen name="Logout" component={LogoutScreen as any} options={{ title: 'Account', animation: 'slide_from_bottom' }} />
        </Stack.Navigator>
    );
}