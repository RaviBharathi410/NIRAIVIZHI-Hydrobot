import React, { createContext, useContext, useState } from 'react';
import { ROLES } from '../constants/roles';

const RoleContext = createContext(null);

export function RoleProvider({ children }) {
    const [currentRole, setCurrentRole] = useState(ROLES.OPTIMUS_X);

    const switchRole = (role) => {
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