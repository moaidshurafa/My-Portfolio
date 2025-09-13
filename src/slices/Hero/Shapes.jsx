"use client";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Float, Environment } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { exp } from "three/tsl";

export const Shapes = () => {
  return (
    <div className="row-span-1 row-start-1 -mt-9 aspect-square md:col-span-1 md:col-start-2 md:mt-0">
      <Canvas
        className="z-0"
        shadows
        gl={{ antialias: false }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 25], fov: 30, near: 1, far: 40 }}
      >
        <Suspense fallback={null}>
          <Geometries />
          <ContactShadows
            position={[0, -3.5, 0]}
            opacity={0.55}
            scale={40}
            blur={1}
            far={9}
          />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
};

const Geometries = () => {
  const geometries = [
    {
      position: [0, 0, 0],
      r: 0.3,
      geometry: new THREE.IcosahedronGeometry(3), //gem,
    },
    {
      position: [1, -0.75, 4],
      r: 0.5,
      geometry: new THREE.CapsuleGeometry(0.5, 1.6, 16, 16), //bill,
    },
    {
      position: [-1.4, 2, -4],
      r: 0.6,
      geometry: new THREE.DodecahedronGeometry(1.5),
    },
    {
      position: [-1, -1.3, -1],
      r: 0.6,
      geometry: new THREE.IcosahedronGeometry(1),
    },
    {
      position: [1, 1, -2],
      r: 0.7,
      geometry: new THREE.OctahedronGeometry(1.2),
    },
  ];
  const materials = [
    // new THREE.MeshNormalMaterial(),
    new THREE.MeshStandardMaterial({ color: 0x7f8c8d, roughness: 0.4 }),
    new THREE.MeshStandardMaterial({ color: 0x34495e, roughness: 0.1 }),
    new THREE.MeshStandardMaterial({
      color: 0x95a5a6,
      roughness: 0.1,
      metalness: 1.5,
    }),
    new THREE.MeshStandardMaterial({
      color: 0xf1c40f,
      roughness: 0.1,
      metalness: 1.5,
    }),
    new THREE.MeshStandardMaterial({
      color: 0x2d3436,
      roughness: 0,
      metalness: 1.5,
    }),
  ];

  const soundEffects = [
    new Audio("/sounds/s1.ogg"),
    new Audio("/sounds/s2.ogg"),
    new Audio("/sounds/s3.ogg"),
    new Audio("/sounds/s4.ogg"),
    new Audio("/sounds/s5.ogg"),
  ];

  return geometries.map(({ position, r, geometry }) => (
    <Geometry
      key={JSON.stringify(position)}
      soundEffects={soundEffects}
      geometry={geometry}
      position={position.map((p) => p * 2)}
      materials={materials}
      r={r}
    />
  ));
};

const Geometry = ({ r, position, geometry, materials, soundEffects }) => {
  const meshRef = useRef();
  const [visible, setVisible] = useState(false);

  const startingMaterial = getRandomMaterial();
  function getRandomMaterial() {
    return gsap.utils.random(materials);
  }

  function handleClick(e) {
    gsap.utils.random(soundEffects).play();
    const mesh = e.object;

    gsap.to(mesh.rotation, {
      x: `+=${gsap.utils.random(0, 2)}`,
      y: `+=${gsap.utils.random(0, 2)}`,
      z: `+=${gsap.utils.random(0, 2)}`,
      duration: 1.4,
      ease: "elastic.out(1,0.3)",
      yoyo: true,
    });
    mesh.material = getRandomMaterial();
  }
  const handlePointOver = () => {
    document.body.style.cursor = "pointer";
  };
  const handlePointerOut = () => {
    document.body.style.cursor = "default";
  };

  useEffect(() => {
    let ctx = gsap.context(() => {
      setVisible(true);
      gsap.from(meshRef.current.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.8,
        delay: 0.4,
        ease: "elastic.out(1,0.3)",
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <group position={position} ref={meshRef}>
      <Float speed={7 * r} rotationIntensity={11 * r} floatIntensity={6 * r}>
        <mesh
          geometry={geometry}
          onClick={handleClick}
          onPointerOver={handlePointOver}
          onPointerOut={handlePointerOut}
          visible={visible}
          material={startingMaterial}
        />
      </Float>
    </group>
  );
};
