import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme/restyleTheme';
import HeaderActions from '../components/HeaderActions';

import { DashboardScreen } from '../screens/Hydrobot/DashboardScreen';
import { RobotControlScreen } from '../screens/Hydrobot/RobotControlScreen';
import { WaterAnalyticsScreen } from '../screens/Hydrobot/WaterAnalyticsScreen';
import { LiveMapScreen } from '../screens/Hydrobot/LiveMapScreen';
import { AlertsScreen } from '../screens/Hydrobot/AlertsScreen';

export type HydrobotTabParamList = {
    Fleet: undefined;
    Control: { id?: string };
    Map: undefined;
    Analytics: { id?: string };
    Alerts: undefined;
};

const Tab = createBottomTabNavigator<HydrobotTabParamList>();

export function HydrobotNavigator() {
    const theme = useTheme<Theme>();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: true,
                headerTintColor: theme.colors.text as string,
                headerTitleStyle: {
                    fontSize: 20,
                    fontWeight: theme.textVariants.heading.fontWeight as any,
                    color: theme.colors.text as string
                },
                headerRight: () => <HeaderActions />,
                headerTitle: route.name === 'Fleet' ? 'NIRAIVIZHI' : route.name,
                headerStyle: {
                    backgroundColor: theme.colors.background as string,
                },
                tabBarActiveTintColor: theme.colors.primary as string,
                tabBarInactiveTintColor: theme.colors.textMuted as string,
                tabBarStyle: {
                    backgroundColor: theme.colors.surface as string,
                    borderTopWidth: 1,
                    borderTopColor: 'rgba(15, 23, 42, 0.05)',
                    height: Platform.OS === 'ios' ? 88 : 68,
                    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
                    paddingTop: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                },
                tabBarIcon: ({ color, size }) => {
                    let iconName: keyof typeof MaterialCommunityIcons.glyphMap;
                    if (route.name === 'Fleet') iconName = 'robot-vacuum';
                    else if (route.name === 'Control') iconName = 'controller-classic';
                    else if (route.name === 'Map') iconName = 'map-marker-radius';
                    else if (route.name === 'Analytics') iconName = 'chart-timeline-variant';
                    else if (route.name === 'Alerts') iconName = 'bell-badge';
                    else iconName = 'help-circle';

                    return <MaterialCommunityIcons name={iconName} size={size + 2} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Fleet" component={DashboardScreen as any} />
            <Tab.Screen name="Control" component={RobotControlScreen as any} />
            <Tab.Screen name="Map" component={LiveMapScreen as any} />
            <Tab.Screen name="Analytics" component={WaterAnalyticsScreen as any} />
            <Tab.Screen name="Alerts" component={AlertsScreen as any} />
        </Tab.Navigator>
    );
}

export default HydrobotNavigator;
