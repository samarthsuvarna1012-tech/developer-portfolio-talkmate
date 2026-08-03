import React, { useState, useEffect, useRef, useCallback } from 'react';

export type OrbStatus = 'idle' | 'listening' | 'speaking' | 'thinking';
export type OrbState = OrbStatus;
export type OrbTone = 'friendly' | 'analytical' | 'energetic' | 'calm' | 'creative';

interface AiOrbProps {
  status?: OrbStatus;
  state?: OrbState;
  tone?: OrbTone | string;
  personality?: string;
  onMicToggle?: () => void;
  isListeningSupported?: boolean;
  attract?: boolean;
}

// Tone / Personality Color Profiles
const TONE_THEMES: Record<string, {
  name: string;
  badgeColor: string;
  bloom1: string;
  bloom2: string;
  nebulaColor: string;
  auraGradient: string;
  coreGradient: string;
  ringColor: string;
  nodeColor: string;
  nodeShadow: string;
  particleColor: string;
}> = {
  friendly: {
    name: 'Friendly',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    bloom1: 'bg-[#00E5FF]/25',
    bloom2: 'bg-[#7C4DFF]/20',
    nebulaColor: 'from-cyan-900/20 via-indigo-950/30 to-purple-950/20',
    auraGradient: 'from-[#00E5FF]/20 via-[#4FC3F7]/25 to-[#7C4DFF]/30 border-[#00E5FF]/40 shadow-[0_0_40px_rgba(0,229,255,0.4)]',
    coreGradient: 'from-[#00E5FF]/40 via-[#4FC3F7]/30 to-[#7C4DFF]/40 shadow-[0_0_35px_rgba(0,229,255,0.4)]',
    ringColor: 'border-cyan-400/30',
    nodeColor: 'bg-[#00E5FF]',
    nodeShadow: 'shadow-[0_0_12px_#00E5FF]',
    particleColor: 'bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]',
  },
  analytical: {
    name: 'Analytical',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    bloom1: 'bg-indigo-500/25',
    bloom2: 'bg-emerald-500/20',
    nebulaColor: 'from-slate-900/30 via-indigo-950/35 to-emerald-950/20',
    auraGradient: 'from-[#38BDF8]/20 via-[#6366F1]/25 to-[#10B981]/30 border-indigo-400/40 shadow-[0_0_40px_rgba(99,102,241,0.4)]',
    coreGradient: 'from-[#38BDF8]/40 via-[#6366F1]/35 to-[#10B981]/40 shadow-[0_0_35px_rgba(99,102,241,0.4)]',
    ringColor: 'border-indigo-400/30',
    nodeColor: 'bg-[#38BDF8]',
    nodeShadow: 'shadow-[0_0_12px_#38BDF8]',
    particleColor: 'bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]',
  },
  energetic: {
    name: 'Energetic',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    bloom1: 'bg-amber-500/25',
    bloom2: 'bg-rose-500/20',
    nebulaColor: 'from-amber-950/20 via-pink-950/25 to-purple-950/20',
    auraGradient: 'from-[#F59E0B]/20 via-[#EC4899]/25 to-[#00E5FF]/30 border-amber-400/40 shadow-[0_0_40px_rgba(245,158,11,0.4)]',
    coreGradient: 'from-[#F59E0B]/40 via-[#EC4899]/35 to-[#00E5FF]/40 shadow-[0_0_35px_rgba(245,158,11,0.4)]',
    ringColor: 'border-amber-400/30',
    nodeColor: 'bg-[#F59E0B]',
    nodeShadow: 'shadow-[0_0_12px_#F59E0B]',
    particleColor: 'bg-[#F59E0B] shadow-[0_0_8px_#F59E0B]',
  },
  calm: {
    name: 'Calm',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    bloom1: 'bg-teal-500/25',
    bloom2: 'bg-emerald-500/20',
    nebulaColor: 'from-teal-950/25 via-slate-900/30 to-emerald-950/20',
    auraGradient: 'from-[#14B8A6]/20 via-[#10B981]/25 to-[#06B6D4]/30 border-teal-400/40 shadow-[0_0_40px_rgba(20,184,166,0.4)]',
    coreGradient: 'from-[#14B8A6]/40 via-[#10B981]/35 to-[#06B6D4]/40 shadow-[0_0_35px_rgba(20,184,166,0.4)]',
    ringColor: 'border-teal-400/30',
    nodeColor: 'bg-[#14B8A6]',
    nodeShadow: 'shadow-[0_0_12px_#14B8A6]',
    particleColor: 'bg-[#14B8A6] shadow-[0_0_8px_#14B8A6]',
  },
  creative: {
    name: 'Creative',
    badgeColor: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
    bloom1: 'bg-fuchsia-500/25',
    bloom2: 'bg-violet-500/20',
    nebulaColor: 'from-fuchsia-950/25 via-purple-950/30 to-cyan-950/20',
    auraGradient: 'from-[#D946EF]/20 via-[#8B5CF6]/25 to-[#00E5FF]/30 border-fuchsia-400/40 shadow-[0_0_40px_rgba(217,70,239,0.4)]',
    coreGradient: 'from-[#D946EF]/40 via-[#8B5CF6]/35 to-[#00E5FF]/40 shadow-[0_0_35px_rgba(217,70,239,0.4)]',
    ringColor: 'border-fuchsia-400/30',
    nodeColor: 'bg-[#D946EF]',
    nodeShadow: 'shadow-[0_0_12px_#D946EF]',
    particleColor: 'bg-[#D946EF] shadow-[0_0_8px_#D946EF]',
  },
};

// 8 distinct 3D Holographic Orbit Rings Configuration
// Every ring is perfectly centered with symmetric insets and cardinal node positions
const RING_CONFIGS = [
  { id: 1, classNormal: 'animate-ring-1', classFast: 'animate-ring-1-fast', inset: 'inset-0', color: 'border-cyan-400/30', nodeColor: 'bg-[#00E5FF]', nodeShadow: 'shadow-[0_0_12px_#00E5FF]', nodePos: '-top-1 left-1/2 -translate-x-1/2' },
  { id: 2, classNormal: 'animate-ring-2', classFast: 'animate-ring-2-fast', inset: 'inset-2', color: 'border-purple-400/35 border-dashed', nodeColor: 'bg-[#7C4DFF]', nodeShadow: 'shadow-[0_0_10px_#7C4DFF]', nodePos: 'top-1/2 -right-1 -translate-y-1/2' },
  { id: 3, classNormal: 'animate-ring-3', classFast: 'animate-ring-3-fast', inset: 'inset-4', color: 'border-[#4FC3F7]/40', nodeColor: 'bg-[#4FC3F7]', nodeShadow: 'shadow-[0_0_8px_#4FC3F7]', nodePos: '-bottom-1 left-1/2 -translate-x-1/2' },
  { id: 4, classNormal: 'animate-ring-4', classFast: 'animate-ring-4-fast', inset: 'inset-6', color: 'border-indigo-400/25 border-dotted', nodeColor: 'bg-indigo-300', nodeShadow: 'shadow-[0_0_8px_#818CF8]', nodePos: 'top-1/2 -left-1 -translate-y-1/2' },
  { id: 5, classNormal: 'animate-ring-5', classFast: 'animate-ring-5-fast', inset: 'inset-8', color: 'border-cyan-300/30', nodeColor: 'bg-cyan-200', nodeShadow: 'shadow-[0_0_10px_#22D3EE]', nodePos: '-bottom-1 left-1/2 -translate-x-1/2' },
  { id: 6, classNormal: 'animate-ring-6', classFast: 'animate-ring-6-fast', inset: 'inset-10', color: 'border-violet-400/35 border-dashed', nodeColor: 'bg-purple-300', nodeShadow: 'shadow-[0_0_8px_#C084FC]', nodePos: '-top-1 left-1/2 -translate-x-1/2' },
  { id: 7, classNormal: 'animate-ring-7', classFast: 'animate-ring-7-fast', inset: 'inset-12', color: 'border-sky-400/30', nodeColor: 'bg-sky-300', nodeShadow: 'shadow-[0_0_10px_#38BDF8]', nodePos: 'top-1/2 -right-1 -translate-y-1/2' },
  { id: 8, classNormal: 'animate-ring-8', classFast: 'animate-ring-8-fast', inset: 'inset-14', color: 'border-emerald-400/25 border-dotted', nodeColor: 'bg-emerald-300', nodeShadow: 'shadow-[0_0_8px_#34D399]', nodePos: 'top-1/2 -left-1 -translate-y-1/2' },
];

// Primary Energy Micro-Nodes (16 Floating Particles)
const INITIAL_PARTICLES = [
  { angle: 0, distance: 112, size: 3, opacity: 0.7, speed: 0.8 },
  { angle: 22.5, distance: 130, size: 2, opacity: 0.4, speed: 1.1 },
  { angle: 45, distance: 105, size: 4, opacity: 0.85, speed: 0.9 },
  { angle: 67.5, distance: 125, size: 2.5, opacity: 0.5, speed: 1.2 },
  { angle: 90, distance: 118, size: 3.5, opacity: 0.75, speed: 0.7 },
  { angle: 112.5, distance: 140, size: 2, opacity: 0.45, speed: 1.0 },
  { angle: 135, distance: 110, size: 3, opacity: 0.65, speed: 0.85 },
  { angle: 157.5, distance: 135, size: 2.5, opacity: 0.55, speed: 1.15 },
  { angle: 180, distance: 102, size: 4, opacity: 0.8, speed: 0.95 },
  { angle: 202.5, distance: 122, size: 2, opacity: 0.4, speed: 1.05 },
  { angle: 225, distance: 115, size: 3, opacity: 0.7, speed: 0.8 },
  { angle: 247.5, distance: 138, size: 2, opacity: 0.6, speed: 1.2 },
  { angle: 270, distance: 98, size: 3.5, opacity: 0.85, speed: 0.9 },
  { angle: 292.5, distance: 128, size: 2, opacity: 0.5, speed: 1.1 },
  { angle: 315, distance: 110, size: 3, opacity: 0.65, speed: 0.75 },
  { angle: 337.5, distance: 132, size: 2.5, opacity: 0.55, speed: 1.0 },
];

// Secondary Atmospheric Stardust Layer (24 Faint Deep Space Particles)
const STARDUST_PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  angle: (i * 15 + Math.sin(i * 1.5) * 12) % 360,
  distance: 130 + (i % 6) * 18,
  size: 1 + (i % 3) * 0.5,
  opacity: 0.12 + (i % 4) * 0.07,
  speed: 0.3 + (i % 5) * 0.15,
}));

// Faint Background Starfield Nodes (12 Stars)
const STARFIELD_STARS = Array.from({ length: 12 }, (_, i) => ({
  x: (i * 37) % 220 - 110,
  y: (i * 53) % 220 - 110,
  size: 1 + (i % 2) * 0.8,
  opacity: 0.2 + (i % 3) * 0.1,
}));

// 12 Calibration Burst Particles
const BURST_PARTICLES = Array.from({ length: 12 }, (_, i) => i * 30);

export const AiOrb: React.FC<AiOrbProps> = React.memo(({
  status,
  state,
  tone = 'friendly',
  personality,
  onMicToggle,
  isListeningSupported = true,
  attract = false,
}) => {
  const currentStatus = status || state || 'idle';
  const isListening = currentStatus === 'listening';
  const isSpeaking = currentStatus === 'speaking';
  const isThinking = currentStatus === 'thinking';

  // Determine active tone theme
  const normalizedTone = (tone || personality || 'friendly').toLowerCase();
  const matchedToneKey = Object.keys(TONE_THEMES).find(k => normalizedTone.includes(k)) || 'friendly';
  const [currentToneKey, setCurrentToneKey] = useState<string>(matchedToneKey);

  useEffect(() => {
    if (matchedToneKey !== currentToneKey) {
      setCurrentToneKey(matchedToneKey);
    }
  }, [matchedToneKey]);

  const activeTheme = TONE_THEMES[currentToneKey] || TONE_THEMES.friendly;

  // Cycle tone manually on click
  const cycleTone = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const keys = Object.keys(TONE_THEMES);
    const currentIndex = keys.indexOf(currentToneKey);
    const nextKey = keys[(currentIndex + 1) % keys.length];
    setCurrentToneKey(nextKey);
  }, [currentToneKey]);

  // State for tap gesture re-calibration
  const [isCalibrating, setIsCalibrating] = useState(false);

  // State for Idle Attract mode (>30s of inactivity)
  const [isIdleAttract, setIsIdleAttract] = useState(attract);
  const lastInteractionTime = useRef<number>(Date.now());

  // Real-time audio frequency analyzer energy (0.0 to 1.0)
  const audioEnergyRef = useRef<number>(0);
  const [audioEnergyState, setAudioEnergyState] = useState<number>(0);

  // DOM Refs for 60 FPS Direct GPU Style Manipulations
  const containerRef = useRef<HTMLDivElement>(null);
  const backdropBgRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const glowCoreRef = useRef<HTMLDivElement>(null);
  const outerRingsLayerRef = useRef<HTMLDivElement>(null);
  const innerRingsLayerRef = useRef<HTMLDivElement>(null);
  const particleSystemRef = useRef<HTMLDivElement>(null);
  const stardustRef = useRef<HTMLDivElement>(null);
  const specularRef = useRef<HTMLDivElement>(null);

  // Inertial Spring Physics State (Ref-based for 60 FPS, zero React re-renders)
  const targetNormX = useRef(0);
  const targetNormY = useRef(0);
  const currentNormX = useRef(0);
  const currentNormY = useRef(0);

  // Spring & Damping velocity for smooth overshoot/decay
  const velocityNormX = useRef(0);
  const velocityNormY = useRef(0);

  // Calculated Tilt Angles (strictly capped at ±10°)
  const currentTiltX = useRef(0);
  const currentTiltY = useRef(0);

  // Scroll offset tilt
  const scrollTiltX = useRef(0);
  const scrollTiltY = useRef(0);

  // Time, Particle Rotation & Animation Frame ID
  const floatAngle = useRef(0);
  const particleRotRef = useRef(0);
  const animFrameId = useRef<number | null>(null);

  // Reset user interaction timer on any activity
  const registerUserActivity = useCallback(() => {
    lastInteractionTime.current = Date.now();
    if (isIdleAttract && !attract) {
      setIsIdleAttract(false);
    }
  }, [isIdleAttract, attract]);

  // Window-wide passive mouse tracking for smooth 3D tilt & parallax
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      registerUserActivity();
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const radiusX = Math.max(320, window.innerWidth / 2);
      const radiusY = Math.max(320, window.innerHeight / 2);

      const normX = (e.clientX - centerX) / radiusX;
      const normY = (e.clientY - centerY) / radiusY;

      targetNormX.current = Math.max(-1, Math.min(1, normX));
      targetNormY.current = Math.max(-1, Math.min(1, normY));
    };

    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    window.addEventListener('mousedown', registerUserActivity, { passive: true });
    window.addEventListener('keydown', registerUserActivity, { passive: true });
    window.addEventListener('touchstart', registerUserActivity, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mousedown', registerUserActivity);
      window.removeEventListener('keydown', registerUserActivity);
      window.removeEventListener('touchstart', registerUserActivity);
    };
  }, [registerUserActivity]);

  // Scroll tilt listener: maps window.scrollY to 3D tilt
  useEffect(() => {
    const handleScroll = () => {
      registerUserActivity();
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      scrollTiltX.current = Math.min(6, Math.max(-6, scrollY * 0.01));
      scrollTiltY.current = Math.sin(scrollY * 0.003) * 4;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [registerUserActivity]);

  // Mouse Move Handler - Normalized cursor tracking
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    registerUserActivity();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const normX = (e.clientX - centerX) / (rect.width / 2);
    const normY = (e.clientY - centerY) / (rect.height / 2);

    targetNormX.current = Math.max(-1, Math.min(1, normX));
    targetNormY.current = Math.max(-1, Math.min(1, normY));
  }, [registerUserActivity]);

  const handleMouseLeave = useCallback(() => {
    targetNormX.current = 0;
    targetNormY.current = 0;
  }, []);

  const handleOrbClick = useCallback(() => {
    registerUserActivity();
    setIsCalibrating(true);
    setTimeout(() => {
      setIsCalibrating(false);
    }, 700);

    if (onMicToggle) {
      onMicToggle();
    }
  }, [onMicToggle, registerUserActivity]);

  // Audio frequency analyzer logic for real-time pulse modulation
  useEffect(() => {
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let mediaStream: MediaStream | null = null;
    let isCancelled = false;

    if (isListening) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then((stream) => {
            if (isCancelled) return;
            mediaStream = stream;
            audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 64;
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            const updateMicLevel = () => {
              if (isCancelled || !analyser) return;
              analyser.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const average = sum / dataArray.length;
              audioEnergyRef.current = Math.min(1, average / 128);
              setAudioEnergyState(audioEnergyRef.current);
              requestAnimationFrame(updateMicLevel);
            };
            updateMicLevel();
          })
          .catch(() => {
            audioEnergyRef.current = 0.45;
            setAudioEnergyState(0.45);
          });
      }
    } else if (isSpeaking) {
      let step = 0;
      const interval = setInterval(() => {
        step += 0.2;
        const wave = (Math.sin(step) + Math.sin(step * 2.3) + 2) / 4;
        audioEnergyRef.current = Math.min(1, wave * 0.85);
        setAudioEnergyState(audioEnergyRef.current);
      }, 80);

      return () => clearInterval(interval);
    } else {
      audioEnergyRef.current = 0;
      setAudioEnergyState(0);
    }

    return () => {
      isCancelled = true;
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close().catch(() => {});
      }
    };
  }, [isListening, isSpeaking]);

  // Main 60 FPS RAF Loop - Pure GPU / Direct Style Manipulation
  useEffect(() => {
    let isActive = true;

    const updateAnimation = () => {
      if (!isActive) return;

      if (document.hidden) {
        animFrameId.current = requestAnimationFrame(updateAnimation);
        return;
      }

      // Check 30-second idle threshold for Attract Mode
      const idleTimeMs = Date.now() - lastInteractionTime.current;
      if (idleTimeMs > 30000 && currentStatus === 'idle' && !isIdleAttract) {
        setIsIdleAttract(true);
      }

      // INERTIAL SPRING & DAMPING PHYSICS
      const spring = 0.08;
      const damping = 0.82;

      velocityNormX.current += (targetNormX.current - currentNormX.current) * spring;
      velocityNormY.current += (targetNormY.current - currentNormY.current) * spring;

      velocityNormX.current *= damping;
      velocityNormY.current *= damping;

      currentNormX.current += velocityNormX.current;
      currentNormY.current += velocityNormY.current;

      const rawTiltX = -currentNormY.current * 10 + scrollTiltX.current;
      const rawTiltY = currentNormX.current * 10 + scrollTiltY.current;

      currentTiltX.current = Math.max(-10, Math.min(10, rawTiltX));
      currentTiltY.current = Math.max(-10, Math.min(10, rawTiltY));

      const proximityDist = Math.sqrt(
        currentNormX.current * currentNormX.current + currentNormY.current * currentNormY.current
      );

      // Organic harmonic floating & subtle wobble motion
      floatAngle.current += isIdleAttract ? 0.015 : 0.025;
      const floatY = Math.sin(floatAngle.current) * (isIdleAttract ? 8 : 5);
      const wobbleX = Math.sin(floatAngle.current * 0.7) * 2.2;
      const wobbleZ = Math.cos(floatAngle.current * 0.5) * 1.5;

      // Particle system continuous orbit angle increment
      particleRotRef.current += isListening || isSpeaking ? 0.75 : 0.35;

      // 1. BACKDROP NEBULA (Anchored depth layer)
      if (backdropBgRef.current) {
        backdropBgRef.current.style.transform = `translate3d(0, 0, -50px)`;
      }

      // 2. HALO & GLOW (Anchored at exact center)
      if (haloRef.current) {
        const stretchX = 1 + Math.abs(currentNormX.current) * 0.06;
        const stretchY = 1 + Math.abs(currentNormY.current) * 0.06;
        haloRef.current.style.transform = `translate3d(0, 0, -20px) scale(${stretchX.toFixed(3)}, ${stretchY.toFixed(3)})`;
      }

      if (glowCoreRef.current) {
        const energyGlow = audioEnergyRef.current;
        const blurAmount = 28 + energyGlow * 30 + proximityDist * 8;
        glowCoreRef.current.style.filter = `blur(${blurAmount.toFixed(1)}px)`;
        glowCoreRef.current.style.opacity = (0.7 + proximityDist * 0.25).toFixed(2);
      }

      // 3. MAIN ORB CONTAINER (3D Tilt & Float around exact center)
      if (orbRef.current) {
        const speechScale = isSpeaking ? 1 + Math.min(0.04, audioEnergyRef.current * 0.04) : 1;
        const attractScale = isIdleAttract ? 1 + Math.sin(floatAngle.current) * 0.03 : 1;
        const totalScale = (speechScale * attractScale).toFixed(3);

        const finalTiltX = (currentTiltX.current + wobbleX).toFixed(2);
        const finalTiltY = currentTiltY.current.toFixed(2);
        const finalTiltZ = wobbleZ.toFixed(2);

        orbRef.current.style.transform = `perspective(1000px) rotateX(${finalTiltX}deg) rotateY(${finalTiltY}deg) rotateZ(${finalTiltZ}deg) translate3d(0, ${floatY.toFixed(2)}px, 0) scale(${totalScale})`;
      }

      // 4. SPECULAR HIGHLIGHT REFLECTION SHIFT ON GLASS CORE
      if (specularRef.current) {
        const shiftX = -currentNormX.current * 10;
        const shiftY = -currentNormY.current * 10;
        specularRef.current.style.transform = `translate3d(${shiftX.toFixed(2)}px, ${shiftY.toFixed(2)}px, 0)`;
      }

      // 5. MULTI-LAYER Z-DEPTH PARALLAX (REMAINS PERFECTLY CENTERED ON ORB CORE)
      if (outerRingsLayerRef.current) {
        outerRingsLayerRef.current.style.transform = `translate3d(0, 0, -15px)`;
      }

      if (innerRingsLayerRef.current) {
        innerRingsLayerRef.current.style.transform = `translate3d(0, 0, 15px)`;
      }

      if (particleSystemRef.current) {
        particleSystemRef.current.style.transform = `translate3d(0, 0, 30px) rotateZ(${particleRotRef.current.toFixed(2)}deg)`;
      }

      if (stardustRef.current) {
        stardustRef.current.style.transform = `translate3d(0, 0, -30px)`;
      }

      animFrameId.current = requestAnimationFrame(updateAnimation);
    };

    animFrameId.current = requestAnimationFrame(updateAnimation);

    return () => {
      isActive = false;
      if (animFrameId.current !== null) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [currentStatus, isIdleAttract, isSpeaking]);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col items-center justify-center p-3 selection:bg-none select-none group cursor-pointer overflow-visible w-full min-h-[320px] sm:min-h-[360px]"
      style={{ transformOrigin: 'center center' }}
    >
      
      {/* ===================================================
          BACKGROUND BACKDROP: NEBULA & STARFIELD (Centered)
          =================================================== */}
      <div 
        ref={backdropBgRef}
        className="absolute inset-0 -m-8 pointer-events-none z-0 overflow-hidden rounded-3xl"
        style={{ transformOrigin: 'center center', willChange: 'transform' }}
      >
        {/* Soft Radial Ambient Nebula Glow */}
        <div className={`absolute inset-0 bg-gradient-to-r ${activeTheme.nebulaColor} blur-3xl opacity-60 transition-colors duration-1000`} />

        {/* Faint Floating Starfield */}
        {STARFIELD_STARS.map((star, idx) => (
          <div
            key={idx}
            className="absolute top-1/2 left-1/2 rounded-full bg-cyan-100 transition-opacity duration-700 animate-pulse pointer-events-none"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              transform: `translate3d(${star.x}px, ${star.y}px, 0)`,
              opacity: isIdleAttract ? star.opacity * 1.5 : star.opacity,
              animationDuration: `${3 + (idx % 4)}s`,
              transformOrigin: 'center center',
            }}
          />
        ))}

        {/* Deep Space Atmospheric Stardust */}
        <div 
          ref={stardustRef} 
          className="absolute inset-0 pointer-events-none" 
          style={{ transformOrigin: 'center center', willChange: 'transform' }}
        >
          {STARDUST_PARTICLES.map((p, idx) => (
            <div
              key={idx}
              className="absolute top-1/2 left-1/2 rounded-full bg-cyan-200 pointer-events-none"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                marginTop: `-${p.size / 2}px`,
                marginLeft: `-${p.size / 2}px`,
                transform: `rotate(${p.angle}deg) translate3d(${p.distance}px, 0, 0)`,
                opacity: isIdleAttract ? p.opacity * 1.4 : p.opacity,
                boxShadow: '0 0 6px rgba(0,229,255,0.6)',
                transformOrigin: 'center center',
              }}
            />
          ))}
        </div>
      </div>

      {/* ===================================================
          MAIN ORB STAGE CONTAINER (3D Tilt & Perspective Anchor)
          =================================================== */}
      <div 
        ref={orbRef}
        className={`relative w-[clamp(210px,36vmin,330px)] h-[clamp(210px,36vmin,330px)] flex items-center justify-center transition-scale duration-500 ease-out group-hover:brightness-125 ${
          isCalibrating ? 'scale-110' : ''
        }`}
        style={{ 
          transformOrigin: 'center center', 
          transformStyle: 'preserve-3d', 
          willChange: 'transform, filter' 
        }}
      >

        {/* ===================================================
            VOLUMETRIC LIGHTING HALO & MAGNETIC GLOW (Centered on Orb Core)
            =================================================== */}
        <div 
          ref={haloRef}
          className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center"
          style={{ transformOrigin: 'center center', willChange: 'transform' }}
        >
          <div 
            ref={glowCoreRef}
            className={`rounded-full transition-colors duration-700 pointer-events-none ${activeTheme.bloom1} ${
              isListening 
                ? 'w-72 h-72 sm:w-80 sm:h-80 scale-110' 
                : isSpeaking 
                ? 'w-80 h-80 sm:w-96 sm:h-96 scale-115' 
                : isThinking 
                ? 'w-72 h-72 sm:w-80 sm:h-80 scale-105'
                : isIdleAttract
                ? 'w-72 h-72 sm:w-80 sm:h-80 scale-110 animate-pulse'
                : 'w-64 h-64 sm:w-72 sm:h-72 scale-100'
            }`}
            style={{ filter: 'blur(32px)', transformOrigin: 'center center' }}
          />
          <div 
            className={`absolute rounded-full transition-all duration-700 pointer-events-none blur-2xl group-hover:scale-115 group-hover:brightness-125 ${activeTheme.bloom2} ${
              isListening 
                ? 'w-48 h-48 opacity-80' 
                : isSpeaking 
                ? 'w-56 h-56 opacity-90' 
                : 'w-44 h-44 opacity-50'
            }`}
            style={{ transformOrigin: 'center center' }}
          />
        </div>

        {/* Shockwave Burst & 12 Burst Particles on Tap Re-calibration */}
        {isCalibrating && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-[#00E5FF] animate-[ping_0.6s_cubic-bezier(0,0,0.2,1)_1] pointer-events-none shadow-[0_0_35px_#00E5FF]" />
            <div className="absolute -inset-4 rounded-full border border-[#7C4DFF] animate-[ping_0.8s_cubic-bezier(0,0,0.2,1)_1] pointer-events-none shadow-[0_0_40px_#7C4DFF]" />
            
            {/* Temporary Burst of 12 Particles expanding and fading */}
            <div className="absolute inset-0 pointer-events-none z-30">
              {BURST_PARTICLES.map((angle, idx) => (
                <div
                  key={idx}
                  className="absolute top-1/2 left-1/2 w-2 h-2 -mt-1 -ml-1 rounded-full bg-[#00E5FF] shadow-[0_0_12px_#00E5FF] animate-[ping_0.65s_ease-out_forwards]"
                  style={{
                    transform: `rotate(${angle}deg) translate3d(140px, 0, 0)`,
                    animationDelay: `${(idx % 3) * 0.04}s`,
                    transformOrigin: 'center center',
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* ===================================================
            ENERGY PARTICLES SYSTEM (16 Floating 3D Micro-Nodes)
            =================================================== */}
        <div 
          ref={particleSystemRef} 
          className="absolute inset-0 pointer-events-none z-15" 
          style={{ transformOrigin: 'center center', transformStyle: 'preserve-3d', willChange: 'transform' }}
        >
          {INITIAL_PARTICLES.map((p, idx) => {
            const currentDist = isCalibrating 
              ? p.distance * 1.35 
              : isListening 
              ? p.distance * 1.12 
              : isSpeaking 
              ? p.distance * (1.08 + audioEnergyState * 0.15) 
              : isIdleAttract
              ? p.distance * 1.06
              : p.distance;
            return (
              <div
                key={idx}
                className={`absolute top-1/2 left-1/2 rounded-full transition-all duration-500 group-hover:scale-125 group-hover:brightness-125 ${activeTheme.particleColor} ${
                  isCalibrating ? 'scale-150 brightness-150' : ''
                }`}
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  marginTop: `-${p.size / 2}px`,
                  marginLeft: `-${p.size / 2}px`,
                  transform: `rotate(${p.angle}deg) translate3d(${currentDist}px, 0, 0)`,
                  opacity: isCalibrating ? 1 : isListening || isSpeaking ? p.opacity * 1.25 : p.opacity,
                  willChange: 'transform, opacity',
                  transformOrigin: 'center center',
                }}
              />
            );
          })}
        </div>

        {/* ===================================================
            8 3D HOLOGRAPHIC ORBIT RINGS (Outer Layer)
            =================================================== */}
        <div 
          ref={outerRingsLayerRef} 
          className="absolute inset-0 pointer-events-none z-10" 
          style={{ transformOrigin: 'center center', transformStyle: 'preserve-3d', willChange: 'transform' }}
        >
          {RING_CONFIGS.slice(0, 4).map((ring) => (
            <div 
              key={ring.id}
              className={`absolute ${ring.inset} rounded-full border ${ring.color} transition-colors duration-500 group-hover:border-opacity-60 ${
                isListening || isSpeaking ? ring.classFast : ring.classNormal
              }`}
              style={{ transformOrigin: 'center center', willChange: 'transform' }}
            >
              {/* Glowing Lead Node on Ring */}
              <div className={`absolute ${ring.nodePos} w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${ring.nodeColor} ${ring.nodeShadow} group-hover:scale-110 transition-transform`} />
            </div>
          ))}
        </div>

        {/* ===================================================
            8 3D HOLOGRAPHIC ORBIT RINGS (Inner Layer)
            =================================================== */}
        <div 
          ref={innerRingsLayerRef} 
          className="absolute inset-0 pointer-events-none z-10" 
          style={{ transformOrigin: 'center center', transformStyle: 'preserve-3d', willChange: 'transform' }}
        >
          {RING_CONFIGS.slice(4).map((ring) => (
            <div 
              key={ring.id}
              className={`absolute ${ring.inset} rounded-full border ${ring.color} transition-colors duration-500 group-hover:border-opacity-60 ${
                isListening || isSpeaking ? ring.classFast : ring.classNormal
              }`}
              style={{ transformOrigin: 'center center', willChange: 'transform' }}
            >
              {/* Glowing Lead Node on Ring */}
              <div className={`absolute ${ring.nodePos} w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${ring.nodeColor} ${ring.nodeShadow} group-hover:scale-110 transition-transform`} />
            </div>
          ))}
        </div>

        {/* ===================================================
            TRANSLUCENT ENERGY SHELL (Refractive Aura with Tone Support)
            =================================================== */}
        <div 
          className={`absolute inset-10 sm:inset-12 rounded-full bg-gradient-to-tr transition-all duration-500 backdrop-blur-md group-hover:scale-105 group-hover:shadow-[0_0_55px_rgba(0,229,255,0.5)] z-18 ${
            isListening
              ? activeTheme.auraGradient
              : isSpeaking
              ? activeTheme.auraGradient
              : isThinking
              ? 'from-[#4FC3F7]/15 via-cyan-500/20 to-[#7C4DFF]/20 border border-cyan-400/30'
              : activeTheme.auraGradient
          }`}
          style={{ transformOrigin: 'center center' }}
        />

        {/* ===================================================
            BRIGHT GLASS CORE WITH REAL-TIME AUDIO MODULATION
            =================================================== */}
        <div 
          onClick={handleOrbClick}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-30 md:h-30 rounded-full cursor-pointer transition-all duration-500 group-hover:brightness-115 overflow-hidden flex items-center justify-center z-20 ${
            isListening
              ? `bg-gradient-to-br ${activeTheme.coreGradient} scale-[1.03]`
              : isSpeaking
              ? `bg-gradient-to-br ${activeTheme.coreGradient} brightness-110 animate-orb-pulse scale-[1.05]`
              : isThinking
              ? 'bg-gradient-to-br from-[#4FC3F7] via-[#00E5FF] to-[#7C4DFF] shadow-[0_0_35px_rgba(79,195,247,0.5),inset_0_0_15px_rgba(255,255,255,0.4)]'
              : `bg-gradient-to-br ${activeTheme.coreGradient} group-hover:scale-105`
          } border border-white/30 backdrop-blur-xl`}
          style={{
            transformOrigin: 'center center',
            boxShadow: audioEnergyState > 0
              ? `0 0 ${30 + audioEnergyState * 40}px rgba(0,229,255,${0.4 + audioEnergyState * 0.4}), inset 0 0 20px rgba(255,255,255,0.6)`
              : undefined
          }}
        >
          {/* Glass 3D Specular Highlight Arc */}
          <div 
            ref={specularRef} 
            className="absolute top-1.5 left-3 right-3 h-1/2 rounded-t-full bg-gradient-to-b from-white/45 via-white/10 to-transparent pointer-events-none transition-transform duration-75"
            style={{ willChange: 'transform' }}
          />

          {/* Glass Inner Radial Refraction Spotlight */}
          <div 
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 35% 28%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.05) 55%, transparent 70%)',
            }}
          />

          {/* Cyan Scan Wave (Listening Mode) */}
          {isListening && (
            <div className="absolute inset-x-0 h-8 bg-gradient-to-b from-transparent via-cyan-300/40 to-transparent animate-scan-wave pointer-events-none" />
          )}

          {/* Thinking Scan Line (Thinking Mode) */}
          {isThinking && (
            <div className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-indigo-300/50 to-transparent animate-scan-wave pointer-events-none" />
          )}

          {/* Core Wave Expanding Ripples (Speaking Mode) */}
          {isSpeaking && (
            <div className="absolute inset-0 rounded-full border border-cyan-300 animate-core-wave pointer-events-none" />
          )}

          {/* Dynamic Real-time Audio Frequency Equalizer Bar */}
          {(isListening || isSpeaking) && (
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-end gap-1 h-3 pointer-events-none">
              <span 
                className="w-1 bg-cyan-200 rounded-full transition-all duration-75"
                style={{ height: `${Math.max(4, (audioEnergyState * 12 + Math.random() * 3))}px` }} 
              />
              <span 
                className="w-1 bg-white rounded-full transition-all duration-75"
                style={{ height: `${Math.max(6, (audioEnergyState * 14 + Math.random() * 4))}px` }} 
              />
              <span 
                className="w-1 bg-purple-200 rounded-full transition-all duration-75"
                style={{ height: `${Math.max(5, (audioEnergyState * 13 + Math.random() * 3))}px` }} 
              />
              <span 
                className="w-1 bg-cyan-100 rounded-full transition-all duration-75"
                style={{ height: `${Math.max(3, (audioEnergyState * 10 + Math.random() * 2))}px` }} 
              />
            </div>
          )}
        </div>

      </div>

      {/* Status Pill & AI Personality Switcher Badge */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800/80 backdrop-blur-md text-xs font-mono shadow-xl z-20">
        <span className={`w-2 h-2 rounded-full ${
          isListening 
            ? 'bg-[#00E5FF] animate-ping' 
            : isSpeaking 
            ? 'bg-[#7C4DFF] animate-pulse' 
            : isThinking 
            ? 'bg-[#4FC3F7] animate-spin' 
            : isIdleAttract
            ? 'bg-amber-400 animate-ping'
            : 'bg-emerald-400'
        }`} />
        
        <span className="text-slate-300 font-medium">
          {isListening 
            ? 'Listening... Speak now' 
            : isSpeaking 
            ? 'Assistant Responding...' 
            : isThinking 
            ? 'Processing Request...' 
            : isIdleAttract
            ? 'AI Core Resting • Tap to wake'
            : 'AI Core Standby'}
        </span>

        {/* Tone/Personality Switcher Pill */}
        <button
          onClick={cycleTone}
          title="Click to shift AI Orb personality theme"
          className={`px-2 py-0.5 rounded border text-[10px] font-bold tracking-wider uppercase transition-all hover:scale-105 ${activeTheme.badgeColor}`}
        >
          {activeTheme.name}
        </button>

        {onMicToggle && isListeningSupported && (
          <button
            onClick={onMicToggle}
            className="ml-0.5 px-2 py-0.5 rounded bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-[10px] text-cyan-300 transition-colors uppercase tracking-wider font-bold"
          >
            {isListening ? 'Stop' : 'Voice'}
          </button>
        )}
      </div>

    </div>
  );
});

AiOrb.displayName = 'AiOrb';
