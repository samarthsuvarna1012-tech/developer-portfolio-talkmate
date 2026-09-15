import React, { Component, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type Quality = 'high' | 'medium' | 'low';

const getQuality = (): Quality => {
  const mobile = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const cores = navigator.hardwareConcurrency ?? 4;
  if (mobile || memory <= 2 || cores <= 2) return 'low';
  return memory >= 8 && cores >= 8 ? 'high' : 'medium';
};

const PARTICLES: Record<Quality, number> = { high: 7000, medium: 3800, low: 1200 };

function NeuralField({ quality, reducedMotion }: { quality: Quality; reducedMotion: boolean }) {
  const points = useRef<THREE.Points>(null);
  const network = useRef<THREE.LineSegments>(null);
  const mouse = useRef(new THREE.Vector2());
  const targetMouse = useRef(new THREE.Vector2());
  const scroll = useRef(0);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2() },
    uMotion: { value: reducedMotion ? 0 : quality === 'low' ? 0.45 : 1 },
  }), [quality, reducedMotion]);

  const data = useMemo(() => {
    const count = PARTICLES[quality];
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const anchors: THREE.Vector3[] = [];
    for (let i = 0; i < count; i += 1) {
      const radius = 2.4 + Math.pow(Math.random(), 0.55) * 8;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 7;
      positions[i * 3] = Math.cos(theta) * radius + (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * radius - 3;
      sizes[i] = 1.2 + Math.random() * 2.8;
      phases[i] = Math.random() * Math.PI * 2;
      if (i < 120) anchors.push(new THREE.Vector3(positions[i * 3], y, positions[i * 3 + 2]));
    }
    const links: number[] = [];
    for (let i = 0; i < anchors.length; i += 1) {
      const next = anchors[(i * 7 + 19) % anchors.length];
      links.push(anchors[i].x, anchors[i].y, anchors[i].z, next.x, next.y, next.z);
    }
    return { positions, sizes, phases, links: new Float32Array(links) };
  }, [quality]);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      targetMouse.current.set((event.clientX / window.innerWidth - 0.5) * 2, -(event.clientY / window.innerHeight - 0.5) * 2);
    };
    const onScroll = () => { scroll.current = window.scrollY; };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useFrame((state, delta) => {
    mouse.current.lerp(targetMouse.current, Math.min(1, delta * 3));
    uniforms.uMouse.value.copy(mouse.current);
    if (!reducedMotion) uniforms.uTime.value += delta;
    const scrollOffset = Math.min(scroll.current * 0.00012, 0.28);
    state.camera.position.x += (mouse.current.x * 0.16 - state.camera.position.x) * Math.min(1, delta * 1.4);
    state.camera.position.y += ((-mouse.current.y * 0.1 + scrollOffset) - state.camera.position.y) * Math.min(1, delta * 1.2);
    state.camera.lookAt(0, scrollOffset * 0.3, -3);
    if (points.current) points.current.rotation.y = uniforms.uTime.value * 0.018;
    if (network.current) {
      network.current.rotation.y = -uniforms.uTime.value * 0.012;
      network.current.rotation.z = Math.sin(uniforms.uTime.value * 0.16) * 0.08;
    }
  });

  return (
    <group>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[data.sizes, 1]} />
          <bufferAttribute attach="attributes-aPhase" args={[data.phases, 1]} />
        </bufferGeometry>
        <shaderMaterial transparent depthWrite={false} blending={THREE.AdditiveBlending} uniforms={uniforms} vertexShader={`
          attribute float aSize; attribute float aPhase; uniform float uTime; uniform vec2 uMouse; uniform float uMotion;
          void main() {
            vec3 p = position;
            float wave = sin(uTime * .55 + aPhase + p.y * .7) * .10 * uMotion;
            float d = distance(p.xy * .12, uMouse);
            p.xy += normalize(p.xy + .001) * smoothstep(1.05, .08, d) * .24 * uMotion;
            p.z += wave;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = aSize * (17.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }
        `} fragmentShader={`
          void main() { float d = length(gl_PointCoord - .5); float glow = smoothstep(.5, .05, d); gl_FragColor = vec4(.20, .82, 1.0, glow * .44); }
        `} />
      </points>
      <lineSegments ref={network}>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[data.links, 3]} /></bufferGeometry>
        <lineBasicMaterial color="#38bdf8" transparent opacity={quality === 'low' ? 0.055 : 0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

class BackgroundErrorBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  declare props: Readonly<{ children: React.ReactNode }>;
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function Interactive3DBackground() {
  const [enabled, setEnabled] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const quality = useMemo(() => getQuality(), []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const supportsWebGL = (() => { const canvas = document.createElement('canvas'); return !!canvas.getContext('webgl2') || !!canvas.getContext('webgl'); })();
    setReducedMotion(media.matches);
    setEnabled(supportsWebGL);
    const visibility = () => setPaused(document.visibilityState !== 'visible');
    const motion = () => setReducedMotion(media.matches);
    document.addEventListener('visibilitychange', visibility);
    media.addEventListener('change', motion);
    return () => { document.removeEventListener('visibilitychange', visibility); media.removeEventListener('change', motion); };
  }, []);

  if (!enabled) return null;
  return <div className="three-background" aria-hidden="true"><BackgroundErrorBoundary><Canvas dpr={quality === 'low' ? [1, 1] : [1, 1.5]} frameloop={paused ? 'never' : 'always'} gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }} camera={{ position: [0, 0, 10], fov: 52 }}><NeuralField quality={quality} reducedMotion={reducedMotion} /></Canvas></BackgroundErrorBoundary></div>;
}
