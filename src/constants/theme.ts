import { Platform, TextStyle, ViewStyle } from 'react-native';
import { LIGHT_THEME } from './lightTheme';

// Explicit type for COLORS to ensure consistency in screens
export type ColorTheme = typeof COLORS_BASE & {
    phScale: string[];
    surfaceLight: string;
    backgroundLight: string;
};

const COLORS_BASE = {
    primary: LIGHT_THEME.primary,      // Indigo-500 (#6366F1)
    primaryDark: LIGHT_THEME.primaryHover,
    primaryLight: LIGHT_THEME.primaryLight,
    secondary: LIGHT_THEME.secondary,
    secondaryHover: LIGHT_THEME.secondaryHover,
    secondaryLight: LIGHT_THEME.secondaryLight,
    accent: LIGHT_THEME.primary,
    accentSoft: LIGHT_THEME.primaryLight,
    accentGlow: 'rgba(99, 102, 241, 0.2)',
    phScale: ['#EF4444', '#F59E0B', '#22C55E', '#3B82F6', '#6366F1'],
    surfaceLight: LIGHT_THEME.surfaceLight || '#F1F5F9',
    backgroundLight: LIGHT_THEME.background,

    // Icon Backgrounds
    iconBlueBg: LIGHT_THEME.iconBlueBg,
    iconGreenBg: LIGHT_THEME.iconGreenBg,
    iconOrangeBg: LIGHT_THEME.iconOrangeBg,
    iconPurpleBg: LIGHT_THEME.iconPurpleBg,

    // Semantic
    success: LIGHT_THEME.success,
    successSoft: LIGHT_THEME.successLight,
    warning: LIGHT_THEME.warning,
    warningSoft: LIGHT_THEME.warningLight,
    danger: LIGHT_THEME.danger,
    dangerSoft: LIGHT_THEME.dangerLight,
    info: LIGHT_THEME.info,
    infoSoft: LIGHT_THEME.infoLight,

    // Surfaces
    background: LIGHT_THEME.background,
    surface: LIGHT_THEME.surface,
    surfaceSecondary: LIGHT_THEME.surfaceSecondary,
    card: LIGHT_THEME.surface,

    // Text
    text: LIGHT_THEME.textPrimary,
    textPrimary: LIGHT_THEME.textPrimary,
    textSecondary: LIGHT_THEME.textSecondary,
    textMuted: LIGHT_THEME.textMuted,
    subText: LIGHT_THEME.textSecondary,
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',

    // Domain Specific
    waterBlue: LIGHT_THEME.info,
    waterGreen: LIGHT_THEME.success,
    border: LIGHT_THEME.border || 'rgba(15, 23, 42, 0.1)',
};

export const COLORS: ColorTheme = COLORS_BASE;

// Explicit type for GRADIENTS
export type GradientTheme = {
    primary: readonly string[];
    accent: readonly string[];
    warning: readonly string[];
    danger: readonly string[];
    success: readonly string[];
    info: readonly string[];
    card: readonly string[];
    header: readonly string[];
    screen: readonly string[];
    glow: readonly string[];
    ring: readonly string[];
};

export const GRADIENTS: GradientTheme = {
    primary: [LIGHT_THEME.primary, '#2563EB'],
    accent: ['#1E3A8A', '#1E40AF'],
    warning: ['#F59E0B', '#D97706'],
    danger: ['#EF4444', '#DC2626'],
    success: ['#22C55E', '#16A34A'],
    info: ['#3B82F6', '#2563EB'],
    card: ['#FFFFFF', '#F1F5F9'],
    header: ['#F8FAFC', '#FFFFFF'],
    screen: ['#F8FAFC', '#F1F5F9'],
    glow: ['rgba(59, 130, 246, 0.12)', 'rgba(59, 130, 246, 0)'],
    ring: [LIGHT_THEME.primary, '#3b82f6'],
};

// Platform-Safe Production Fonts
export const FONTS: Record<string, TextStyle> = {
    regular: {
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto', web: 'system-ui' }),
        fontWeight: '400',
    },
    medium: {
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto', web: 'system-ui' }),
        fontWeight: '500',
    },
    semiBold: {
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto', web: 'system-ui' }),
        fontWeight: '600',
    },
    bold: {
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto', web: 'system-ui' }),
        fontWeight: '700',
    },
    extraBold: {
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto', web: 'system-ui' }),
        fontWeight: '800',
    },
};

// Fallback System Fonts
export const FONTS_FALLBACK = FONTS;

// Typography Scale
export const TEXT = {
    '4xl': { fontSize: 36, lineHeight: 44 },
    '3xl': { fontSize: 30, lineHeight: 38 },
    '2xl': { fontSize: 24, lineHeight: 32 },
    xl: { fontSize: 20, lineHeight: 28 },
    lg: { fontSize: 18, lineHeight: 26 },
    md: { fontSize: 16, lineHeight: 24 },
    sm: { fontSize: 14, lineHeight: 20 },
    xs: { fontSize: 12, lineHeight: 16 },
    xxs: { fontSize: 10, lineHeight: 14 },
} as const;

// Spacing System (4px base)
export const SPACE = {
    1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 7: 28, 8: 32, 9: 36, 10: 40, 12: 48, 14: 56, 16: 64, 20: 80, 24: 96,
} as const;

// Radius & Sizes
export const SIZES = {
    radiusSm: 8,
    radius: 14,
    radiusLg: 22,
    radiusFull: 999,
} as const;

// Shape helpers for consistency
export const SHAPE = {
    button: { borderRadius: SIZES.radius },
    card: { borderRadius: SIZES.radiusLg },
    pill: { borderRadius: SIZES.radiusFull },
    iconBox: { borderRadius: SIZES.radiusSm },
} as const;

// Professional Soft Shadows
export const SHADOWS = {
    small: Platform.select({
        web: { boxShadow: '0px 2px 8px rgba(15, 23, 42, 0.04)' },
        ios: {
            shadowColor: "#0F172A", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 5,
        },
        android: { elevation: 2 },
    }),
    medium: Platform.select({
        web: { boxShadow: '0px 8px 20px rgba(15, 23, 42, 0.06)' },
        ios: {
            shadowColor: "#0F172A", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.06, shadowRadius: 12,
        },
        android: { elevation: 4 },
    }),
    large: Platform.select({
        web: { boxShadow: '0px 15px 35px rgba(15, 23, 42, 0.08)' },
        ios: {
            shadowColor: "#0F172A", shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.08, shadowRadius: 20,
        },
        android: { elevation: 8 },
    }),
    glow: (color = COLORS.primary, radius = 20, opacity = 0.15) =>
        Platform.select({
            web: { boxShadow: `0px 0px ${radius}px ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}` },
            default: {
                shadowColor: color, shadowOffset: { width: 0, height: 0 }, shadowOpacity: opacity, shadowRadius: radius, elevation: radius / 2,
            }
        })
};

// Animation Presets (Reanimated)
export const SPRING = {
    gentle: { damping: 20, stiffness: 150, mass: 1 },
    bouncy: { damping: 12, stiffness: 200, mass: 0.8 },
    stiff: { damping: 28, stiffness: 350, mass: 1 },
    snappy: { damping: 15, stiffness: 400, mass: 0.6 },
} as const;

// Timing Presets
export const TIMING = {
    fast: 200,
    normal: 350,
    slow: 600,
    stagger: 60,
} as const;

// Glassmorphism System (Light Mode optimized)
export const GLASS: Record<string, { blur: number, bg: string, border: string }> = {
    default: { blur: 20, bg: 'rgba(255, 255, 255, 0.7)', border: 'rgba(15, 23, 42, 0.08)' },
    light: { blur: 15, bg: 'rgba(255, 255, 255, 0.5)', border: 'rgba(15, 23, 42, 0.05)' },
    medium: { blur: 30, bg: 'rgba(255, 255, 255, 0.8)', border: 'rgba(15, 23, 42, 0.1)' },
    elevated: { blur: 35, bg: 'rgba(255, 255, 255, 0.85)', border: 'rgba(15, 23, 42, 0.12)' },
    heavy: { blur: 50, bg: 'rgba(241, 245, 249, 0.9)', border: 'rgba(15, 23, 42, 0.15)' },
};

export default { COLORS, GRADIENTS, FONTS, FONTS_FALLBACK, TEXT, SPACE, SIZES, SHAPE, SHADOWS, SPRING, TIMING, GLASS };
