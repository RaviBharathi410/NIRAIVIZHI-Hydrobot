import { createTheme } from '@shopify/restyle';
import { Platform } from 'react-native';
import { COLORS, SPACE, SIZES } from './theme';

const theme = createTheme({
    colors: {
        primary: COLORS.primary,
        primaryLight: COLORS.primaryLight,
        secondary: COLORS.textSecondary,
        danger: COLORS.danger,
        success: COLORS.success,
        warning: COLORS.warning,
        background: COLORS.background,
        surface: COLORS.surface,
        text: COLORS.text,
        textSecondary: COLORS.textSecondary,
        textMuted: COLORS.textMuted,
        white: COLORS.white,
        transparent: 'transparent',
        border: COLORS.border || 'rgba(15, 23, 42, 0.1)',
    },
    spacing: {
        none: 0,
        xs: SPACE[1],
        s: SPACE[2],
        m: SPACE[4],
        l: SPACE[6],
        xl: SPACE[8],
        xxl: SPACE[12],
    },
    breakpoints: {
        phone: 0,
        tablet: 768,
    },
    textVariants: {
        heading: {
            fontSize: 32,
            fontWeight: '700',
            color: 'text',
        },
        subheading: {
            fontSize: 24,
            fontWeight: '600',
            color: 'text',
        },
        body: {
            fontSize: 16,
            fontWeight: '400',
            color: 'textSecondary',
        },
        caption: {
            fontSize: 13,
            fontWeight: '400',
            color: 'textMuted',
        },
        mono: {
            fontSize: 14,
            fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
            color: 'primary',
        },
        defaults: {
            fontSize: 16,
            color: 'text',
        },
    },
});

export type Theme = typeof theme;
export default theme;
