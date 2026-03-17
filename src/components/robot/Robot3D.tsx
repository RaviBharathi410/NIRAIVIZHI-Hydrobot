import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';

function AnimatedBlob() {
    const meshRef = useRef<any>();
    const wireRef = useRef<any>();

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        if (meshRef.current) {
            meshRef.current.rotation.x = t * 0.2;
            meshRef.current.rotation.y = t * 0.3;
        }
        if (wireRef.current) {
            wireRef.current.rotation.x = -t * 0.1;
            wireRef.current.rotation.y = -t * 0.15;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>


            {/* Tech Wireframe Layer */}
            <Sphere ref={wireRef} args={[1.15, 32, 32]}>
                <meshPhongMaterial
                    color="#00B4D8"
                    wireframe
                    transparent
                    opacity={0.3}
                    emissive="#00B4D8"
                    emissiveIntensity={0.5}
                />
            </Sphere>
        </Float>
    );
}

export default function Robot3D() {
    return (
        <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <AnimatedBlob />
            <Environment preset="city" />
            <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
    );
}
