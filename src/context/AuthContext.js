import React, { createContext, useContext, useState, useEffect } from 'react';
import storage from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const userData = await storage.get(storage.KEYS.USER_DATA);
            if (userData) {
                console.log('Restoring session for:', userData.name);
                setUser(userData);
                setIsAuthenticated(true);
            } else {
                console.log('No active session found.');
            }
        } catch (e) {
            console.error('Failed to load user:', e);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (userData) => {
        setIsLoading(true);
        try {
            setUser(userData);
            setIsAuthenticated(true);
            await storage.set(storage.KEYS.USER_DATA, userData);
            await storage.set(storage.KEYS.USER_ROLE, userData.role);
        } catch (e) {
            console.error('Login storage error:', e);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            setUser(null);
            setIsAuthenticated(false);
            await storage.remove(storage.KEYS.USER_DATA);
            await storage.remove(storage.KEYS.USER_ROLE);
            await storage.remove(storage.KEYS.AUTH_TOKEN);
        } catch (e) {
            console.error('Logout storage error:', e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}

export default AuthContext;