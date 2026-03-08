export type Role = 'optimusx' | 'admin' | 'asha' | 'health_official' | 'community_member' | 'village_leader';

export const ROLES: Record<string, Role> = {
    OPTIMUS_X: 'optimusx',
    ADMIN: 'admin',
    ASHA_WORKER: 'asha',
    HEALTH_OFFICIAL: 'health_official',
    COMMUNITY_MEMBER: 'community_member',
    VILLAGE_LEADER: 'village_leader',
};

export const ROLE_LABELS: Record<string, string> = {
    [ROLES.OPTIMUS_X]: 'OptimusX Operator',
    [ROLES.ADMIN]: 'System Administrator',
    [ROLES.ASHA_WORKER]: 'ASHA Worker',
    [ROLES.HEALTH_OFFICIAL]: 'Health Official',
    [ROLES.COMMUNITY_MEMBER]: 'Community Member',
    [ROLES.VILLAGE_LEADER]: 'Village Leader',
};

export const ROLE_COLORS: Record<string, string> = {
    [ROLES.OPTIMUS_X]: '#00B4D8',
    [ROLES.ASHA_WORKER]: '#FF6B9D',
    [ROLES.HEALTH_OFFICIAL]: '#00C853',
    [ROLES.COMMUNITY_MEMBER]: '#FFB300',
    [ROLES.VILLAGE_LEADER]: '#7C4DFF',
};

export default { ROLES, ROLE_LABELS, ROLE_COLORS };
