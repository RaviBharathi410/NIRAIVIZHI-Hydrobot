import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OptimusXHomePage from '../screens/OptimusX/OptimusXHomePage';
import TDSTestingScreen from '../screens/OptimusX/TDSTestingScreen';
import PHTestingScreen from '../screens/OptimusX/PHTestingScreen';
import TurbidityTestingScreen from '../screens/OptimusX/TurbidityTestingScreen';
import FleetManagementScreen from '../screens/OptimusX/FleetManagementScreen';
import BotDetailsScreen from '../screens/OptimusX/BotDetailsScreen';
import AIVisionScreen from '../screens/OptimusX/AIVisionScreen';
import SmartChargingScreen from '../screens/OptimusX/SmartChargingScreen';
import GasSensingScreen from '../screens/OptimusX/GasSensingScreen';
import HydrobotValveControlsScreen from '../screens/OptimusX/HydrobotValveControlsScreen';
import DualConveyorControlScreen from '../screens/OptimusX/DualConveyorControlScreen';
import ObstacleDetectionScreen from '../screens/OptimusX/ObstacleDetectionScreen';
import LiveTrashAnalyticsScreen from '../screens/OptimusX/LiveTrashAnalyticsScreen';
import HyacinthProcessingScreen from '../screens/OptimusX/HyacinthProcessingScreen';
import EcoDisposalMethodsScreen from '../screens/OptimusX/EcoDisposalMethodsScreen';
import FloodRiskAlertScreen from '../screens/OptimusX/FloodRiskAlertScreen';
import PredictiveAnalyticsScreen from '../screens/OptimusX/PredictiveAnalyticsScreen';
import CitizenPortalScreen from '../screens/OptimusX/CitizenPortalScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import PatientEntryScreen from '../screens/Patient/PatientEntryScreen';
import MLSymptomsScreen from '../screens/ML/MLSymptomsScreen';
// Shared screens
import ContactScreen from '../screens/Shared/ContactScreen';
import JudgesFAQScreen from '../screens/Shared/JudgesFAQScreen';
import LogoutScreen from '../screens/Shared/LogoutScreen';
import { COLORS, FONTS } from '../constants/theme';

const Stack = createNativeStackNavigator();

const SCREEN_OPTIONS = {
    animation: 'slide_from_right',
    headerTransparent: true,
    headerBlurEffect: 'dark', // iOS only
    headerTintColor: COLORS.white,
    headerTitleStyle: { ...FONTS.semiBold, fontSize: 18, color: COLORS.white },
    headerShadowVisible: false,
    contentStyle: { backgroundColor: COLORS.background },
};

export default function OptimusXStack() {
    return (
        <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
            <Stack.Screen name="Home" component={OptimusXHomePage} options={{ headerShown: false }} />
            <Stack.Screen name="TDSTesting" component={TDSTestingScreen} options={{ title: 'TDS Testing' }} />
            <Stack.Screen name="PHTesting" component={PHTestingScreen} options={{ title: 'pH Testing' }} />
            <Stack.Screen name="TurbidityTesting" component={TurbidityTestingScreen} options={{ title: 'Turbidity' }} />
            <Stack.Screen name="FleetManagement" component={FleetManagementScreen} options={{ title: 'Fleet Management' }} />
            <Stack.Screen name="BotDetails" component={BotDetailsScreen} options={{ title: 'Bot Details' }} />
            <Stack.Screen name="AIVision" component={AIVisionScreen} options={{ title: 'AI Vision' }} />
            <Stack.Screen name="SmartCharging" component={SmartChargingScreen} options={{ title: 'Smart Charging' }} />
            <Stack.Screen name="GasSensing" component={GasSensingScreen} options={{ title: 'Gas Sensing' }} />
            <Stack.Screen name="HydrobotValveControls" component={HydrobotValveControlsScreen} options={{ title: 'Valve Controls' }} />
            <Stack.Screen name="DualConveyorControl" component={DualConveyorControlScreen} options={{ title: 'Conveyors' }} />
            <Stack.Screen name="ObstacleDetection" component={ObstacleDetectionScreen} options={{ title: 'Obstacle Detection' }} />
            <Stack.Screen name="LiveTrashAnalytics" component={LiveTrashAnalyticsScreen} options={{ title: 'Trash Analytics' }} />
            <Stack.Screen name="HyacinthProcessing" component={HyacinthProcessingScreen} options={{ title: 'Hyacinth Processing' }} />
            <Stack.Screen name="EcoDisposalMethods" component={EcoDisposalMethodsScreen} options={{ title: 'Eco Disposal' }} />
            <Stack.Screen name="FloodRiskAlert" component={FloodRiskAlertScreen} options={{ title: 'Flood Risk Alert' }} />
            <Stack.Screen name="PredictiveAnalytics" component={PredictiveAnalyticsScreen} options={{ title: 'Predictive Analytics' }} />
            <Stack.Screen name="CitizenPortal" component={CitizenPortalScreen} options={{ title: 'Citizen Portal' }} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
            <Stack.Screen name="PatientEntry" component={PatientEntryScreen} options={{ title: 'Patient Entry' }} />
            <Stack.Screen name="MLSymptoms" component={MLSymptomsScreen} options={{ title: 'AI Diagnosis' }} />
            <Stack.Screen name="Contact" component={ContactScreen} options={{ title: 'Contact' }} />
            <Stack.Screen name="JudgesFAQ" component={JudgesFAQScreen} options={{ title: "Judge's FAQ" }} />
            <Stack.Screen name="Logout" component={LogoutScreen} options={{ title: 'Account', animation: 'slide_from_bottom' }} />
        </Stack.Navigator>
    );
}