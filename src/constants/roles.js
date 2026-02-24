export const ROLES = {
    OPTIMUS_X: 'optimusx',
    ASHA_WORKER: 'asha',
    HEALTH_OFFICIAL: 'health_official',
    COMMUNITY_MEMBER: 'community_member',
    VILLAGE_LEADER: 'village_leader',
};

export const ROLE_LABELS = {
    [ROLES.OPTIMUS_X]: 'OptimusX Operator',
    [ROLES.ASHA_WORKER]: 'ASHA Worker',
    [ROLES.HEALTH_OFFICIAL]: 'Health Official',
    [ROLES.COMMUNITY_MEMBER]: 'Community Member',
    [ROLES.VILLAGE_LEADER]: 'Village Leader',
};

export const ROLE_COLORS = {
    [ROLES.OPTIMUS_X]: '#00B4D8',
    [ROLES.ASHA_WORKER]: '#FF6B9D',
    [ROLES.HEALTH_OFFICIAL]: '#00C853',
    [ROLES.COMMUNITY_MEMBER]: '#FFB300',
    [ROLES.VILLAGE_LEADER]: '#7C4DFF',
};

export default { ROLES, ROLE_LABELS, ROLE_COLORS };
