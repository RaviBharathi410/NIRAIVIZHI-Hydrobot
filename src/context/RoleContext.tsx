import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ROLES, Role } from '../constants/roles';

interface RoleContextType {
    currentRole: Role;
    switchRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextType | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
    const [currentRole, setCurrentRole] = useState<Role>(ROLES.OPTIMUS_X);

    const switchRole = (role: Role) => {
        if (Object.values(ROLES).includes(role)) {
            setCurrentRole(role);
        }
    };

    return (
        <RoleContext.Provider value={{ currentRole, switchRole }}>
            {children}
        </RoleContext.Provider>
    );
}

export function useRole() {
    const context = useContext(RoleContext);
    if (!context) throw new Error('useRole must be used within RoleProvider');
    return context;
}

export default RoleContext;