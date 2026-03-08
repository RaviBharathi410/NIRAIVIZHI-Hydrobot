import { Platform } from 'react-native';
import { LIGHT_THEME } from './lightTheme';

// Professional Medical Slate/Indigo Palette
export const COLORS = {
    primary: LIGHT_THEME.primary,      // Indigo-500 (#6366F1)
    primaryDark: '#4338CA',           // Indigo-700
    primaryLight: LIGHT_THEME.primaryLight, // Indigo-50
    accent: LIGHT_THEME.primary,
    accentSoft: LIGHT_THEME.primaryLight,
    accentGlow: 'rgba(99, 102, 241, 0.2)',

    // Semantic
    success: LIGHT_THEME.success,     // Emerald-500
    successSoft: LIGHT_THEME.successLight,
    warning: LIGHT_THEME.warning,     // Amber-500
    warningSoft: LIGHT_THEME.warningLight,
    danger: LIGHT_THEME.danger,       // Red-500
    dangerSoft: LIGHT_THEME.dangerLight,
    info: LIGHT_THEME.info,           // Blue-500
    infoSoft: LIGHT_THEME.infoLight,

    // Surfaces (Light)
    background: LIGHT_THEME.background,
    surface: LIGHT_THEME.surface,
    surfaceSecondary: LIGHT_THEME.surfaceSecondary,
    card: LIGHT_THEME.surface,

    // Text
    text: LIGHT_THEME.textPrimary,
    textSecondary: LIGHT_THEME.textSecondary,
    textMuted: LIGHT_THEME.textMuted,
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',

    // Domain Specific
    waterBlue: LIGHT_THEME.info,
    waterGreen: LIGHT_THEME.success,
};

// Rich Depth Gradients
export const GRADIENTS = {
    primary: [LIGHT_THEME.primary, '#2563EB'],
    accent: ['#1E3A8A', '#1E40AF'],
    card: ['#262626', '#171717'],
    header: ['#171717', '#262626'],
    screen: ['#171717', '#262626'],
    glow: ['rgba(59, 130, 246, 0.15)', 'rgba(59, 130, 246, 0)'],
    ring: [LIGHT_THEME.primary, '#60A5FA'],
};

// Platform-Safe Production Fonts
export const FONTS = {
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
};

// Spacing System (4px base)
export const SPACE = {
    1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 7: 28, 8: 32, 9: 36, 10: 40, 12: 48, 14: 56, 16: 64, 20: 80, 24: 96,
};

// Radius & Sizes
export const SIZES = {
    radiusSm: 8,
    radius: 14,
    radiusLg: 22,
    radiusFull: 999,
};

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
};

// Timing Presets
export const TIMING = {
    fast: 200,
    normal: 350,
    slow: 600,
    stagger: 60,
};

// Glassmorphism System (Dark Mode optimized)
export const GLASS = {
    default: { blur: 30, bg: 'rgba(38, 38, 38, 0.5)', border: 'rgba(255, 255, 255, 0.05)' },
    light: { blur: 20, bg: 'rgba(38, 38, 38, 0.3)', border: 'rgba(255, 255, 255, 0.03)' },
    medium: { blur: 40, bg: 'rgba(38, 38, 38, 0.6)', border: 'rgba(255, 255, 255, 0.06)' },
    elevated: { blur: 40, bg: 'rgba(38, 38, 38, 0.7)', border: 'rgba(255, 255, 255, 0.08)' },
    heavy: { blur: 60, bg: 'rgba(23, 23, 23, 0.8)', border: 'rgba(255, 255, 255, 0.1)' },
};

export default { COLORS, GRADIENTS, FONTS, FONTS_FALLBACK, TEXT, SPACE, SIZES, SHADOWS, SPRING, TIMING, GLASS };
