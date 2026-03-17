import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACE } from '../constants/theme';
import HeaderActions from './HeaderActions';
import { MotiView } from 'moti';

interface ScreenHeaderProps {
    title: string;
    subtitle?: string;
    showBack?: boolean;
    showMenu?: boolean;
    showActions?: boolean;
    style?: ViewStyle;
}

export const ScreenHeader = ({
    title,
    subtitle,
    showBack = true,
    showMenu = false,
    showActions = true,
    style
}: ScreenHeaderProps) => {
    const navigation = useNavigation();

    return (
        <MotiView
            from={{ opacity: 0, translateY: -10 }}
            animate={{ opacity: 1, translateY: 0 }}
            style={[styles.container, style]}
        >
            <View style={styles.topRow}>
                <View style={styles.leftSection}>
                    {showBack && (
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.backBtn}
                            activeOpacity={0.7}
                        >
                            <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.text} />
                        </TouchableOpacity>
                    )}
                    {showMenu && !showBack && (
                        <TouchableOpacity
                            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                            style={styles.backBtn}
                            activeOpacity={0.7}
                        >
                            <MaterialCommunityIcons name="menu" size={26} color={COLORS.text} />
                        </TouchableOpacity>
                    )}
                    <View>
                        <Text style={styles.title}>{title}</Text>
                        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                    </View>
                </View>

                {showActions && <HeaderActions />}
            </View>
        </MotiView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACE[6],
        width: '100%',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    backBtn: {
        marginRight: SPACE[4],
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        ...FONTS.extraBold,
        fontSize: 26,
        color: COLORS.text,
    },
    subtitle: {
        ...FONTS.medium,
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
});

export default ScreenHeader;
