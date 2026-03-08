import React from 'react';
import { ROLES, Role } from '../constants/roles';
import HydrobotNavigator from './HydrobotNavigator';
import AshaStack from './AshaStack';
import HealthOfficialStack from './HealthOfficialStack';
import CommunityMemberStack from './CommunityMemberStack';
import VillageLeaderStack from './VillageLeaderStack';
import OptimusXStack from './OptimusXStack';

interface AppNavigatorProps {
    role?: Role | string;
}

export default function AppNavigator({ role }: AppNavigatorProps) {
    switch (role) {
        case ROLES.OPTIMUS_X: return <HydrobotNavigator />;
        case ROLES.ASHA_WORKER: return <AshaStack />;
        case ROLES.HEALTH_OFFICIAL: return <HealthOfficialStack />;
        case ROLES.COMMUNITY_MEMBER: return <CommunityMemberStack />;
        case ROLES.VILLAGE_LEADER: return <VillageLeaderStack />;
        case ROLES.ADMIN: return <OptimusXStack />;
        default: return <OptimusXStack />; // Simple fallback
    }
}