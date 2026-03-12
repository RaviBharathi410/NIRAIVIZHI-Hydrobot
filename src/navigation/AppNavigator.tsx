import React from 'react';
import { ROLES, Role } from '../constants/roles';
import GlobalDrawer from './GlobalDrawer';

interface AppNavigatorProps {
    role?: Role | string;
}

export default function AppNavigator({ role }: AppNavigatorProps) {
    return <GlobalDrawer initialRole={role || ROLES.OPTIMUS_X} />;
}