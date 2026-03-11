import React from 'react';
import { ROLES, Role } from '../constants/roles';
import HydrobotStack from './HydrobotStack';
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
        case ROLES.OPTIMUS_X: return <OptimusXStack />;     // Premium OptimusX Hub
        case 'hydrobot': return <HydrobotStack />;           // Standard Hydrobot Tier
        case ROLES.ASHA_WORKER: return <AshaStack />;
        case ROLES.HEALTH_OFFICIAL: return <HealthOfficialStack />;
        case ROLES.COMMUNITY_MEMBER: return <CommunityMemberStack />;
        case ROLES.VILLAGE_LEADER: return <VillageLeaderStack />;
        default: return <OptimusXStack />;                   // Fallback to OptimusX for demo
    }
}