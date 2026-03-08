import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
import { MotiView, MotiText, AnimatePresence } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, FONTS, SIZES, SHADOWS, SPRING } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';

const { width, height } = Dimensions.get('window');
const CX = width / 2;
const CY = height / 2;

// ─── Sonar grid ───────────────────────────────────────────────────────────────
function SonarGrid({ opacity }) {
  const rings = [60, 110, 165, 220, 280];
  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity }]} pointerEvents="none">
      {rings.map((r) => (
        <View key={r} style={{
          position: 'absolute',
          left: CX - r, top: CY - r,
          width: r * 2, height: r * 2,
          borderRadius: r,
          borderWidth: 0.5, borderColor: 'rgba(59, 130, 246, 0.08)',
        }} />
      ))}
      <View style={[styles.crossH, { top: CY }]} />
      <View style={[styles.crossV, { left: CX }]} />
      {[45, 135].map((deg) => (
        <View key={deg} style={{
          position: 'absolute',
          left: CX - 280, top: CY,
          width: 560, height: 0.5,
          backgroundColor: 'rgba(59, 130, 246, 0.08)',
          transform: [{ rotate: `${deg}deg` }],
        }} />
      ))}
    </Animated.View>
  );
}

// ─── Sonar sweep arm ──────────────────────────────────────────────────────────
function SonarSweep({ visible }) {
  const rot = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!visible) return;
    Animated.loop(
      Animated.timing(rot, { toValue: 1, duration: 3000, easing: Easing.linear, useNativeDriver: true })
    ).start();
  }, [visible]);
  const rotate = rot.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return (
    <Animated.View style={[styles.sweepContainer, { transform: [{ rotate }] }]} pointerEvents="none">
      <View style={styles.sweepArm} />
      {[10, 25, 45, 70].map((deg, i) => (
        <View key={i} style={[styles.sweepTrail, {
          opacity: 0.12 - i * 0.025,
          transform: [{ rotate: `-${deg}deg` }],
        }]} />
      ))}
    </Animated.View>
  );
}

// ─── Hex logo ─────────────────────────────────────────────────────────────────
function HexLogo({ progress }) {
  const ring1Op = progress.interpolate({ inputRange: [0, 0.3, 0.5], outputRange: [0, 1, 1], extrapolate: 'clamp' });
  const ring2Op = progress.interpolate({ inputRange: [0.2, 0.5, 0.7], outputRange: [0, 1, 1], extrapolate: 'clamp' });
  const ring3Op = progress.interpolate({ inputRange: [0.4, 0.7, 1], outputRange: [0, 1, 1], extrapolate: 'clamp' });
  const scaleV = progress.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0.4, 1.06, 1], extrapolate: 'clamp' });
  const glowOp = progress.interpolate({ inputRange: [0.5, 1], outputRange: [0, 1], extrapolate: 'clamp' });
  const RING1 = 44, RING2 = 72, RING3 = 96;

  const hexCorners = (r) => [...Array(6)].map((_, i) => {
    const a = (Math.PI / 180) * (60 * i - 30);
    return { x: r * Math.cos(a) - 3, y: r * Math.sin(a) - 3 };
  });

  return (
    <Animated.View style={[{ width: RING3 * 2 + 16, height: RING3 * 2 + 16, alignItems: 'center', justifyContent: 'center' }, { transform: [{ scale: scaleV }] }]}>
      <Animated.View style={[{
        position: 'absolute', width: RING3 * 2 + 40, height: RING3 * 2 + 40,
        borderRadius: RING3 + 20, backgroundColor: 'rgba(59, 130, 246, 0.06)',
        ...SHADOWS.glow(COLORS.primary, 30, 0.5),
      }, { opacity: glowOp }]} />

      <Animated.View style={[{
        position: 'absolute', width: RING3 * 2, height: RING3 * 2, borderRadius: RING3,
        borderWidth: 0.5, borderColor: 'rgba(59, 130, 246, 0.18)',
      }, { opacity: ring3Op }]} />

      <Animated.View style={[{
        position: 'absolute', width: RING2 * 2, height: RING2 * 2, borderRadius: RING2,
        borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.4)', borderStyle: 'dashed',
      }, { opacity: ring2Op }]} />

      <Animated.View style={[{
        position: 'absolute', width: RING1 * 2, height: RING1 * 2, borderRadius: RING1,
        borderWidth: 1.5, borderColor: COLORS.primary, backgroundColor: 'rgba(59, 130, 246, 0.07)',
        alignItems: 'center', justifyContent: 'center',
        ...SHADOWS.glow(COLORS.primary, 12, 0.8),
      }, { opacity: ring1Op }]}>
        <View style={{ alignItems: 'center', gap: 6 }}>
          {[30, 22, 26].map((w, i) => <WaveBar key={i} width={w} delay={i * 120} />)}
        </View>
      </Animated.View>

      {hexCorners(RING2).map((pos, i) => (
        <Animated.View key={i} style={[{
          position: 'absolute', width: 6, height: 6, borderRadius: 3,
          backgroundColor: COLORS.primary, left: pos.x + RING3 + 8, top: pos.y + RING3 + 8,
          ...SHADOWS.glow(COLORS.primary, 4, 1),
        }, { opacity: ring2Op }]} />
      ))}
    </Animated.View>
  );
}

// ─── Wave bar ─────────────────────────────────────────────────────────────────
function WaveBar({ width: w, delay }) {
  return (
    <MotiView
      from={{ opacity: 0.4 }}
      animate={{ opacity: 1 }}
      transition={{
        type: 'timing',
        duration: 700,
        delay,
        loop: true,
        repeatReverse: true,
        easing: Easing.inOut(Easing.sin),
      }}
      style={{ height: 3, borderRadius: 2, backgroundColor: COLORS.primary, width: w }}
    />
  );
}

// ─── Glitch title ─────────────────────────────────────────────────────────────
function GlitchTitle({ show }) {
  if (!show) return null;

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 400 }}
      style={styles.titleContainer}
    >
      <MotiText
        from={{ translateX: 0 }}
        animate={{ translateX: [3, -2, 0] }}
        transition={{
          loop: true,
          duration: 180,
          delay: 2000,
          type: 'timing',
        }}
        style={[styles.titleGhost, { color: 'rgba(239, 68, 68, 0.4)' }]}
      >
        AQUA<Text style={{ color: 'rgba(239, 68, 68, 0.4)' }}>GUARD</Text>
      </MotiText>
      <MotiText
        from={{ translateX: 0 }}
        animate={{ translateX: [-3, 2, 0] }}
        transition={{
          loop: true,
          duration: 180,
          delay: 2000,
          type: 'timing',
        }}
        style={[styles.titleGhost, { color: 'rgba(59, 130, 246, 0.4)' }]}
      >
        AQUA<Text style={{ color: 'rgba(59, 130, 246, 0.4)' }}>GUARD</Text>
      </MotiText>
      <Text style={styles.titleReal}>AQUA<Text style={styles.titleAccent}>GUARD</Text></Text>
    </MotiView>
  );
}

// ─── Ticker subtitle ──────────────────────────────────────────────────────────
function TickerSubtitle({ show }) {
  const FULL = '— O P T I M U S   X —';
  const [chars, setChars] = useState('');
  useEffect(() => {
    if (!show) return;
    let i = 0;
    const id = setInterval(() => { i++; setChars(FULL.slice(0, i)); if (i >= FULL.length) clearInterval(id); }, 55);
    return () => clearInterval(id);
  }, [show]);
  return <Text style={styles.subtitle}>{chars}</Text>;
}

// ─── Metric chip ──────────────────────────────────────────────────────────────
function MetricChip({ label, value, unit, color, index }) {
  return (
    <MotiView
      from={{ translateX: -50, opacity: 0 }}
      animate={{ translateX: 0, opacity: 1 }}
      transition={{ type: 'spring', delay: 2500 + index * 150, ...SPRING.gentle }}
    >
      <GlassCard variant="default" style={styles.chipInner} animate={false}>
        <View style={styles.chipContent}>
          <View style={[styles.chipDot, { backgroundColor: color }]} />
          <View>
            <Text style={styles.chipLabel}>{label}</Text>
            <Text style={[styles.chipValue, { color }]}>{value}<Text style={styles.chipUnit}> {unit}</Text></Text>
          </View>
        </View>
      </GlassCard>
    </MotiView>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
function WaterProgress({ show }) {
  const [pct, setPct] = useState(0);

  return (
    <View style={styles.progressOuter}>
      <Text style={styles.progressLabel}>SYSTEM INITIALISING</Text>
      <View style={styles.progressTrack}>
        <MotiView
          from={{ width: 0 }}
          animate={{ width: width * 0.55 }}
          onDidAnimate={(key, finished, value) => {
            // Mock percentage update visually
          }}
          transition={{ delay: 3000, duration: 1500, type: 'timing', easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) }}
          style={styles.progressFill}
        >
          <View style={styles.progressEdge} />
        </MotiView>
      </View>
      <MotiText
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3000 }}
        style={styles.progressPct}
      >
        OPTIMIZING...
      </MotiText>
    </View>
  );
}

// ─── Particle ─────────────────────────────────────────────────────────────────
function DataParticle({ x, size, duration, delay, baseOp }) {
  return (
    <MotiView
      from={{ translateY: height * 0.8, opacity: 0 }}
      animate={{ translateY: height * 0.1, opacity: [0, baseOp, baseOp, 0] }}
      transition={{
        loop: true,
        duration,
        delay,
        type: 'timing',
        easing: Easing.linear,
      }}
      style={[styles.particle, {
        left: x, width: size, height: size, borderRadius: size / 2,
        backgroundColor: COLORS.primary,
        ...SHADOWS.glow(COLORS.primary, 3, 0.8),
      }]}
      pointerEvents="none"
    />
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function IntroScreen(props) {
  const { onFinish } = props;
  const gridOp = useRef(new Animated.Value(0)).current;
  const hexProgress = useRef(new Animated.Value(0)).current;
  const screenOp = useRef(new Animated.Value(1)).current;
  const screenY = useRef(new Animated.Value(0)).current;

  const [sonarOn, setSonarOn] = useState(false);
  const [titleOn, setTitleOn] = useState(false);
  const [tickOn, setTickOn] = useState(false);
  const [metricsOn, setMetricsOn] = useState(false);
  const [barOn, setBarOn] = useState(false);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(gridOp, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(hexProgress, { toValue: 1, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
    ]).start();

    const timers = [
      setTimeout(() => setSonarOn(true), 600),
      setTimeout(() => setTitleOn(true), 1500),
      setTimeout(() => setTickOn(true), 2000),
      setTimeout(() => setMetricsOn(true), 2500),
      setTimeout(() => setBarOn(true), 3000),
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(screenOp, { toValue: 0, duration: 600, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
          Animated.timing(screenY, { toValue: -height * 0.08, duration: 600, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
        ]).start(() => {
          if (onFinish) {
            onFinish();
          } else if (props.navigation) {
            props.navigation.replace('LanguageSelection');
          }
        });
      }, 4800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const particles = [...Array(15)].map((_, i) => ({
    key: i,
    x: Math.random() * width,
    size: Math.random() * 3 + 1.5,
    duration: Math.random() * 5000 + 5000,
    delay: Math.random() * 4000,
    baseOp: Math.random() * 0.4 + 0.15,
  }));

  return (
    <Animated.View style={[styles.root, { opacity: screenOp, transform: [{ translateY: screenY }] }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient colors={GRADIENTS.screen} style={StyleSheet.absoluteFill} />

      {particles.map((p) => <DataParticle key={p.key} {...p} />)}
      <SonarGrid opacity={gridOp} />
      <SonarSweep visible={sonarOn} />

      {/* Logo — positioned in upper-center */}
      <View style={styles.logoArea}>
        <HexLogo progress={hexProgress} />
      </View>

      {/* Text block */}
      <View style={styles.textBlock}>
        <GlitchTitle show={titleOn} />
        <TickerSubtitle show={tickOn} />
        <AnimatePresence>
          {tickOn && (
            <MotiView
              from={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 200, duration: 600 }}
              style={styles.divider}
            >
              <View style={styles.dividerLine} />
              <View style={styles.dividerDiamond} />
              <View style={styles.dividerLine} />
            </MotiView>
          )}
        </AnimatePresence>
      </View>

      {/* Metric chips */}
      {metricsOn && (
        <View style={styles.chips}>
          <MetricChip index={0} label="pH LEVEL" value="7.4" unit="neutral" color={COLORS.primary} />
          <MetricChip index={1} label="TDS SENSOR" value="142" unit="ppm" color="#F0C040" />
          <MetricChip index={2} label="DO LEVEL" value="8.3" unit="mg/L" color="#4DFF9E" />
        </View>
      )}

      {barOn && <WaterProgress />}

      {/* HUD corner marks */}
      {[styles.cornerTL, styles.cornerTR, styles.cornerBL, styles.cornerBR].map((c, i) => (
        <View key={i} style={[styles.corner, c]} pointerEvents="none" />
      ))}

      <Text style={styles.version}>OPTIMUS OS  v2.4.0</Text>
    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#171717', alignItems: 'center', justifyContent: 'center' },

  crossH: { position: 'absolute', left: 0, right: 0, height: 0.5, backgroundColor: 'rgba(59, 130, 246, 0.08)' },
  crossV: { position: 'absolute', top: 0, bottom: 0, width: 0.5, backgroundColor: 'rgba(59, 130, 246, 0.08)' },

  sweepContainer: {
    position: 'absolute',
    left: CX - 280, top: CY - 280,
    width: 560, height: 560,
    borderRadius: 280,
    overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center',
  },
  sweepArm: {
    position: 'absolute', left: 280, top: 280,
    width: 280, height: 1.5,
    backgroundColor: 'rgba(59, 130, 246, 0.35)',
    ...SHADOWS.glow(COLORS.primary, 8, 0.9),
  },
  sweepTrail: {
    position: 'absolute', left: 280, top: 280,
    width: 280, height: 1.5,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
  },

  logoArea: {
    position: 'absolute',
    top: height * 0.18,
    alignItems: 'center', justifyContent: 'center',
  },

  textBlock: { alignItems: 'center', marginTop: height * 0.38 },
  titleContainer: { alignItems: 'center', justifyContent: 'center' },

  titleGhost: {
    position: 'absolute',
    ...FONTS.extraBold,
    fontSize: 34, letterSpacing: 8,
  },
  titleReal: {
    ...FONTS.extraBold,
    fontSize: 34,
    color: COLORS.white, letterSpacing: 8,
    textShadowColor: COLORS.primary, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 20,
  },
  titleAccent: { color: COLORS.primary },

  subtitle: {
    marginTop: 8, fontSize: 11, ...FONTS.bold,
    color: COLORS.textSecondary, letterSpacing: 6,
  },

  divider: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: 14, width: width * 0.6,
  },
  dividerLine: { flex: 1, height: 0.5, backgroundColor: 'rgba(59, 130, 246, 0.3)' },
  dividerDiamond: {
    width: 6, height: 6, borderWidth: 1,
    borderColor: COLORS.primary, transform: [{ rotate: '45deg' }], marginHorizontal: 8,
  },

  chips: {
    position: 'absolute',
    bottom: height * 0.22,
    flexDirection: 'row',
    gap: 8, paddingHorizontal: 16,
  },
  chipInner: {
    padding: 0,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  chipContent: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  chipDot: { width: 5, height: 5, borderRadius: 2.5 },
  chipLabel: { fontSize: 8, color: COLORS.textSecondary, letterSpacing: 1.5, ...FONTS.bold },
  chipValue: { fontSize: 14, ...FONTS.bold, letterSpacing: 0.5 },
  chipUnit: { fontSize: 9, color: COLORS.textMuted, ...FONTS.regular },

  progressOuter: {
    position: 'absolute', bottom: height * 0.1, alignItems: 'center', gap: 6,
  },
  progressLabel: { fontSize: 9, color: COLORS.textMuted, letterSpacing: 3, ...FONTS.bold },
  progressTrack: {
    width: width * 0.55, height: 3,
    backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: 2, overflow: 'hidden',
  },
  progressFill: {
    height: '100%', backgroundColor: COLORS.primary, borderRadius: 2,
    ...SHADOWS.glow(COLORS.primary, 6, 1),
  },
  progressEdge: {
    position: 'absolute', right: 0, top: -1, bottom: -1,
    width: 8, backgroundColor: '#fff', opacity: 0.7, borderRadius: 2,
  },
  progressPct: { fontSize: 9, color: COLORS.primary, letterSpacing: 2, ...FONTS.bold },

  particle: {
    position: 'absolute',
  },

  corner: { position: 'absolute', width: 20, height: 20, borderColor: 'rgba(59, 130, 246, 0.4)' },
  cornerTL: { top: 24, left: 24, borderTopWidth: 1, borderLeftWidth: 1 },
  cornerTR: { top: 24, right: 24, borderTopWidth: 1, borderRightWidth: 1 },
  cornerBL: { bottom: 24, left: 24, borderBottomWidth: 1, borderLeftWidth: 1 },
  cornerBR: { bottom: 24, right: 24, borderBottomWidth: 1, borderRightWidth: 1 },

  version: {
    position: 'absolute', bottom: 14,
    fontSize: 9, color: COLORS.textMuted, letterSpacing: 3, ...FONTS.bold,
  },
});
