import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACE } from '../constants/theme';
import Text from './atoms/Text';
import { useAuth } from '../context/AuthContext';

export default function CustomDrawerContent(props: any) {
    const { logout, user } = useAuth();
    
    return (
        <View style={styles.container}>
            <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollArea}>
                <View style={styles.drawerHeader}>
                    <View style={styles.avatar}>
                        <MaterialCommunityIcons name="account" size={36} color={COLORS.primary} />
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={styles.greeting}>Operator DNA</Text>
                        <Text style={styles.userName}>{user?.name || 'Administrator'}</Text>
                        <View style={styles.roleBadge}>
                            <Text style={styles.roleText}>{user?.role?.replace(/_/g, ' ') || 'OPTIMUS X'}</Text>
                        </View>
                    </View>
                </View>
                
                <View style={styles.divider} />
                
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
            
            <View style={styles.footer}>
                <View style={styles.divider} />
                <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                    <MaterialCommunityIcons name="power" size={20} color={COLORS.danger} />
                    <Text style={styles.logoutText}>End Session</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollArea: {
        paddingTop: Platform.OS === 'ios' ? 40 : 20,
    },
    drawerHeader: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    headerInfo: {
        marginLeft: 16,
        justifyContent: 'center',
    },
    greeting: {
        ...FONTS.medium,
        fontSize: 12,
        color: COLORS.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    userName: {
        ...FONTS.bold,
        fontSize: 18,
        color: COLORS.text,
        marginBottom: 4,
    },
    roleBadge: {
        backgroundColor: COLORS.primary + '20',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    roleText: {
        ...FONTS.bold,
        fontSize: 10,
        color: COLORS.primary,
        textTransform: 'uppercase',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginVertical: 10,
        marginHorizontal: 20,
    },
    footer: {
        paddingBottom: 40,
        paddingTop: 10,
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginHorizontal: 20,
        marginTop: 10,
        borderRadius: 12,
        backgroundColor: COLORS.danger + '10',
    },
    logoutText: {
        ...FONTS.bold,
        fontSize: 14,
        color: COLORS.danger,
        marginLeft: 12,
    }
});
