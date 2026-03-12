import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTheme } from '@shopify/restyle';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { Theme } from '../theme/restyleTheme';
import { COLORS, FONTS } from '../constants/theme';
import { ROLES } from '../constants/roles';

import OptimusXStack from './OptimusXStack';
import HydrobotStack from './HydrobotStack';
import AshaStack from './AshaStack';
import HealthOfficialStack from './HealthOfficialStack';
import CommunityMemberStack from './CommunityMemberStack';
import VillageLeaderStack from './VillageLeaderStack';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';

const Drawer = createDrawerNavigator();

export default function GlobalDrawer({ initialRole }: { initialRole: string }) {
    const theme = useTheme<Theme>();

    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerType: Platform.OS === 'web' ? 'permanent' : 'front',
                drawerStyle: {
                    backgroundColor: COLORS.background,
                    width: Platform.OS === 'web' ? 280 : 300,
                    borderRightWidth: 1,
                    borderRightColor: 'rgba(255,255,255,0.05)'
                },
                overlayColor: 'rgba(5, 10, 25, 0.7)',
                drawerActiveBackgroundColor: COLORS.primary + '20',
                drawerActiveTintColor: COLORS.primary,
                drawerInactiveTintColor: COLORS.textSecondary,
                drawerLabelStyle: {
                    ...FONTS.semiBold,
                    fontSize: 15,
                    marginLeft: -10
                }
            }}
            initialRouteName="Dashboard"
        >
            {initialRole === ROLES.OPTIMUS_X && (
                <Drawer.Screen 
                    name="Dashboard" 
                    component={OptimusXStack} 
                    options={{ 
                        title: 'Command Center',
                        drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="monitor-dashboard" color={color} size={size} />
                    }} 
                />
            )}
            
            {initialRole === ROLES.ASHA_WORKER && (
                <Drawer.Screen 
                    name="Dashboard" 
                    component={AshaStack} 
                    options={{ 
                        title: 'Asha Portal',
                        drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="heart-pulse" color={color} size={size} />
                    }} 
                />
            )}
            
            {initialRole === ROLES.HEALTH_OFFICIAL && (
                <Drawer.Screen 
                    name="Dashboard" 
                    component={HealthOfficialStack} 
                    options={{ 
                        title: 'Health Official',
                        drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="office-building" color={color} size={size} />
                    }} 
                />
            )}

            {initialRole === 'hydrobot' && (
                <Drawer.Screen 
                    name="Dashboard" 
                    component={HydrobotStack} 
                    options={{ 
                        title: 'Hydrobot Fleet',
                        drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="robot-industrial" color={color} size={size} />
                    }} 
                />
            )}

            {initialRole === ROLES.COMMUNITY_MEMBER && (
                <Drawer.Screen 
                    name="Dashboard" 
                    component={CommunityMemberStack} 
                    options={{ 
                        title: 'Community Portal',
                        drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="account-group" color={color} size={size} />
                    }} 
                />
            )}

            {initialRole === ROLES.VILLAGE_LEADER && (
                <Drawer.Screen 
                    name="Dashboard" 
                    component={VillageLeaderStack} 
                    options={{ 
                        title: 'Village Overview',
                        drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="home-city-outline" color={color} size={size} />
                    }} 
                />
            )}

            <Drawer.Screen 
                name="Profile" 
                component={ProfileScreen} 
                options={{ 
                    title: 'My Profile',
                    drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="account-circle-outline" color={color} size={size} />
                }} 
            />
            <Drawer.Screen 
                name="Settings" 
                component={SettingsScreen} 
                options={{ 
                    title: 'System Settings',
                    drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="cog-outline" color={color} size={size} />
                }} 
            />
        </Drawer.Navigator>
    );
}
