import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
    AUTH_TOKEN: '@aquaguard_auth_token',
    USER_ROLE: '@aquaguard_user_role',
    LANGUAGE: '@aquaguard_language',
    USER_DATA: '@aquaguard_user_data',
    SENSOR_DATA: '@aquaguard_sensor_data',
};

export const storage = {
    async set(key, value) {
        try {
            const jsonValue = typeof value === 'string' ? value : JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (e) {
            console.error('Storage set error:', e);
        }
    },

    async get(key) {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value === null) return null;
            try {
                return JSON.parse(value);
            } catch {
                return value;
            }
        } catch (e) {
            console.error('Storage get error:', e);
            return null;
        }
    },

    async remove(key) {
        try {
            await AsyncStorage.removeItem(key);
        } catch (e) {
            console.error('Storage remove error:', e);
        }
    },

    async clear() {
        try {
            await AsyncStorage.clear();
        } catch (e) {
            console.error('Storage clear error:', e);
        }
    },

    KEYS,
};

export default storage;