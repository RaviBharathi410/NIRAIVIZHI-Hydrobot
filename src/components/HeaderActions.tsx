import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACE, SHADOWS } from '../constants/theme';
import { MotiView } from 'moti';

export const HeaderActions = () => {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <MotiView
                from={{ opacity: 0, translateX: 20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'spring', delay: 300 } as any}
                style={styles.actionRow}
            >
                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => navigation.navigate('Settings')}
                    activeOpacity={0.7}
                >
                    <MaterialCommunityIcons name="cog-outline" size={22} color={COLORS.text} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionBtn, styles.logoutBtn]}
                    onPress={() => navigation.navigate('Logout')}
                    activeOpacity={0.7}
                >
                    <MaterialCommunityIcons name="power" size={22} color={COLORS.danger} />
                </TouchableOpacity>
            </MotiView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginRight: 10,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: Platform.OS === 'web' ? 'rgba(255, 255, 255, 0.8)' : COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...Platform.select({
            web: {
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            } as any,
            default: {
                elevation: 2,
            }
        }),
    },
    logoutBtn: {
        borderColor: 'rgba(255, 59, 48, 0.2)',
        backgroundColor: Platform.OS === 'web' ? 'rgba(255, 59, 48, 0.05)' : COLORS.surface,
    }
});

export default HeaderActions;
