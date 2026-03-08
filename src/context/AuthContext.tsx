import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '../services/api';
import storage from '../utils/storage';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    token?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const token = await storage.get(storage.KEYS.AUTH_TOKEN);
            const userData = await storage.get(storage.KEYS.USER_DATA);

            if (token && userData) {
                console.log('Restoring secure session for:', userData.email || userData.name || 'User');
                setUser(userData);
                setIsAuthenticated(true);
            }
        } catch (e) {
            console.error('Session restore failed:', e);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await apiService.login(email, password);

            const { user: userData, token } = response;

            if (!userData || !token) {
                throw new Error('Invalid server response');
            }

            setUser(userData);
            setIsAuthenticated(true);

            await storage.set(storage.KEYS.AUTH_TOKEN, token);
            await storage.set(storage.KEYS.USER_DATA, userData);
            await storage.set(storage.KEYS.USER_ROLE, userData.role);

            return { success: true };
        } catch (e: any) {
            console.error('Login error:', e);
            return { success: false, error: e.message };
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