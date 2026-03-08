import React from 'react';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
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

export type OptimusXStackParamList = {
    Home: undefined;
    TDSTesting: undefined;
    PHTesting: undefined;
    TurbidityTesting: undefined;
    FleetManagement: undefined;
    BotDetails: { bot: any };
    AIVision: undefined;
    SmartCharging: undefined;
    GasSensing: undefined;
    HydrobotValveControls: undefined;
    DualConveyorControl: undefined;
    ObstacleDetection: undefined;
    LiveTrashAnalytics: undefined;
    HyacinthProcessing: undefined;
    EcoDisposalMethods: undefined;
    FloodRiskAlert: undefined;
    PredictiveAnalytics: undefined;
    CitizenPortal: undefined;
    Settings: undefined;
    Profile: undefined;
    PatientEntry: undefined;
    MLSymptoms: undefined;
    Contact: undefined;
    JudgesFAQ: undefined;
    Logout: undefined;
};

const Stack = createNativeStackNavigator<OptimusXStackParamList>();

const SCREEN_OPTIONS: NativeStackNavigationOptions = {
    animation: 'slide_from_right',
    headerTransparent: true,
    headerBlurEffect: 'light',
    headerTintColor: COLORS.text,
    headerTitleStyle: { ...FONTS.semiBold, fontSize: 18, color: COLORS.text } as any,
    headerShadowVisible: false,
    contentStyle: { backgroundColor: COLORS.background },
};

export default function OptimusXStack() {
    return (
        <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
            <Stack.Screen name="Home" component={OptimusXHomePage as any} options={{ headerShown: false }} />
            <Stack.Screen name="TDSTesting" component={TDSTestingScreen as any} options={{ title: 'TDS Testing' }} />
            <Stack.Screen name="PHTesting" component={PHTestingScreen as any} options={{ title: 'pH Testing' }} />
            <Stack.Screen name="TurbidityTesting" component={TurbidityTestingScreen as any} options={{ title: 'Turbidity' }} />
            <Stack.Screen name="FleetManagement" component={FleetManagementScreen as any} options={{ title: 'Fleet Management' }} />
            <Stack.Screen name="BotDetails" component={BotDetailsScreen as any} options={{ title: 'Bot Details' }} />
            <Stack.Screen name="AIVision" component={AIVisionScreen as any} options={{ title: 'AI Vision' }} />
            <Stack.Screen name="SmartCharging" component={SmartChargingScreen as any} options={{ title: 'Smart Charging' }} />
            <Stack.Screen name="GasSensing" component={GasSensingScreen as any} options={{ title: 'Gas Sensing' }} />
            <Stack.Screen name="HydrobotValveControls" component={HydrobotValveControlsScreen as any} options={{ title: 'Valve Controls' }} />
            <Stack.Screen name="DualConveyorControl" component={DualConveyorControlScreen as any} options={{ title: 'Conveyors' }} />
            <Stack.Screen name="ObstacleDetection" component={ObstacleDetectionScreen as any} options={{ title: 'Obstacle Detection' }} />
            <Stack.Screen name="LiveTrashAnalytics" component={LiveTrashAnalyticsScreen as any} options={{ title: 'Trash Analytics' }} />
            <Stack.Screen name="HyacinthProcessing" component={HyacinthProcessingScreen as any} options={{ title: 'Hyacinth Processing' }} />
            <Stack.Screen name="EcoDisposalMethods" component={EcoDisposalMethodsScreen as any} options={{ title: 'Eco Disposal' }} />
            <Stack.Screen name="FloodRiskAlert" component={FloodRiskAlertScreen as any} options={{ title: 'Flood Risk Alert' }} />
            <Stack.Screen name="PredictiveAnalytics" component={PredictiveAnalyticsScreen as any} options={{ title: 'Predictive Analytics' }} />
            <Stack.Screen name="CitizenPortal" component={CitizenPortalScreen as any} options={{ title: 'Citizen Portal' }} />
            <Stack.Screen name="Settings" component={SettingsScreen as any} options={{ title: 'Settings' }} />
            <Stack.Screen name="Profile" component={ProfileScreen as any} options={{ title: 'Profile' }} />
            <Stack.Screen name="PatientEntry" component={PatientEntryScreen as any} options={{ title: 'Patient Entry' }} />
            <Stack.Screen name="MLSymptoms" component={MLSymptomsScreen as any} options={{ title: 'AI Diagnosis' }} />
            <Stack.Screen name="Contact" component={ContactScreen as any} options={{ title: 'Contact' }} />
            <Stack.Screen name="JudgesFAQ" component={JudgesFAQScreen as any} options={{ title: "Judge's FAQ" }} />
            <Stack.Screen name="Logout" component={LogoutScreen as any} options={{ title: 'Account', animation: 'slide_from_bottom' }} />
        </Stack.Navigator>
    );
}