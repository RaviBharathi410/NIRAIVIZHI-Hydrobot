import React from 'react';
import { ROLES } from '../constants/roles';
import OptimusXStack from './OptimusXStack';
import AshaStack from './AshaStack';
import HealthOfficialStack from './HealthOfficialStack';
import CommunityMemberStack from './CommunityMemberStack';
import VillageLeaderStack from './VillageLeaderStack';

export default function AppNavigator({ role }) {
    switch (role) {
        case ROLES.OPTIMUS_X: return <OptimusXStack />;
        case ROLES.ASHA_WORKER: return <AshaStack />;
        case ROLES.HEALTH_OFFICIAL: return <HealthOfficialStack />;
        case ROLES.COMMUNITY_MEMBER: return <CommunityMemberStack />;
        case ROLES.VILLAGE_LEADER: return <VillageLeaderStack />;
        default: return <OptimusXStack />;
    }
}