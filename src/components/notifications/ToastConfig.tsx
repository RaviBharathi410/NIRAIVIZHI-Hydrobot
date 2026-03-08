import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

export const toastConfig: ToastConfig = {
    success: (props) => (
        <BaseToast
            {...props}
            style={{ borderLeftColor: COLORS.success, height: 70, borderRadius: 12 }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 16,
                fontWeight: '700',
                color: COLORS.text
            }}
            text2Style={{
                fontSize: 13,
                color: COLORS.textSecondary
            }}
            renderLeadingIcon={() => (
                <View style={styles.leadingIcon}>
                    <MaterialCommunityIcons name="check-circle" size={24} color={COLORS.success} />
                </View>
            )}
        />
    ),
    error: (props) => (
        <ErrorToast
            {...props}
            style={{ borderLeftColor: COLORS.danger, height: 70, borderRadius: 12 }}
            text1Style={{
                fontSize: 16,
                fontWeight: '700',
                color: COLORS.text
            }}
            text2Style={{
                fontSize: 13,
                color: COLORS.textSecondary
            }}
            renderLeadingIcon={() => (
                <View style={styles.leadingIcon}>
                    <MaterialCommunityIcons name="alert-circle" size={24} color={COLORS.danger} />
                </View>
            )}
        />
    ),
    info: (props) => (
        <BaseToast
            {...props}
            style={{ borderLeftColor: COLORS.primary, height: 70, borderRadius: 12 }}
            text1Style={{
                fontSize: 16,
                fontWeight: '700',
                color: COLORS.text
            }}
            text2Style={{
                fontSize: 13,
                color: COLORS.textSecondary
            }}
            renderLeadingIcon={() => (
                <View style={styles.leadingIcon}>
                    <MaterialCommunityIcons name="information" size={24} color={COLORS.primary} />
                </View>
            )}
        />
    )
};

const styles = StyleSheet.create({
    leadingIcon: {
        width: 50,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 10
    }
});
