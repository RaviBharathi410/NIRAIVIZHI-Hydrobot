import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BaseToast, ToastConfig } from 'react-native-toast-message';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

export const toastConfig: ToastConfig = {
    critical: (props) => (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: '#FF6B6B',
                backgroundColor: '#1A0505',
                height: 70,
                borderRadius: 12,
                borderLeftWidth: 6
            }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{ color: '#FF6B6B', fontWeight: 'bold', fontSize: 16 }}
            text2Style={{ color: '#AAAAAA', fontSize: 13 }}
            renderLeadingIcon={() => (
                <View style={styles.leadingIcon}>
                    <MaterialCommunityIcons name="alert-octagon" size={24} color="#FF6B6B" />
                </View>
            )}
        />
    ),
    warning: (props) => (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: '#FFA94D',
                backgroundColor: '#1A0D05',
                height: 70,
                borderRadius: 12,
                borderLeftWidth: 6
            }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{ color: '#FFA94D', fontWeight: 'bold', fontSize: 16 }}
            text2Style={{ color: '#AAAAAA', fontSize: 13 }}
            renderLeadingIcon={() => (
                <View style={styles.leadingIcon}>
                    <MaterialCommunityIcons name="alert" size={24} color="#FFA94D" />
                </View>
            )}
        />
    ),
    info: (props) => (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: '#3B82F6',
                backgroundColor: '#050D1A',
                height: 70,
                borderRadius: 12,
                borderLeftWidth: 6
            }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{ color: '#3B82F6', fontWeight: 'bold', fontSize: 16 }}
            text2Style={{ color: '#AAAAAA', fontSize: 13 }}
            renderLeadingIcon={() => (
                <View style={styles.leadingIcon}>
                    <MaterialCommunityIcons name="information" size={24} color="#3B82F6" />
                </View>
            )}
        />
    ),
    success: (props) => (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: '#34D399',
                backgroundColor: '#051A0D',
                height: 70,
                borderRadius: 12,
                borderLeftWidth: 6
            }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{ color: '#34D399', fontWeight: 'bold', fontSize: 16 }}
            text2Style={{ color: '#AAAAAA', fontSize: 13 }}
            renderLeadingIcon={() => (
                <View style={styles.leadingIcon}>
                    <MaterialCommunityIcons name="check-circle" size={24} color="#34D399" />
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

export default toastConfig;
