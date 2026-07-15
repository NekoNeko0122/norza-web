"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "@/components/theme/ThemeProvider";

function PointerParallax({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!group.current) return;
    // keep this barely noticeable, should feel still not reactive
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * 0.006, 0.01);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -pointer.y * 0.004, 0.01);
  });

  return <group ref={group}>{children}</group>;
}

export default function Hero3DScene() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <PointerParallax>
          <Sparkles
            count={70}
            scale={9}
            size={2}
            speed={0.3}
            color={isDark ? "#ffd7ea" : "#ffb3d6"}
            opacity={isDark ? 0.7 : 0.5}
          />
        </PointerParallax>
      </Suspense>
    </Canvas>
  );
}
