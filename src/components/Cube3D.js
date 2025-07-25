import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Edges, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// A single cubie piece.
const Cubie = ({ position, rotation }) => {
    const meshRef = useRef();

    // The materials are calculated once based on the initial solved-state position
    const materials = useMemo(() => {
        const colors = { R: '#B71C1C', L: '#FF6D00', U: '#FFFFFF', D: '#FFD600', F: '#00C853', B: '#0D47A1', inner: '#373737' };
        const faceColors = [
            position.x === 1 ? colors.R : colors.inner,
            position.x === -1 ? colors.L : colors.inner,
            position.y === 1 ? colors.U : colors.inner,
            position.y === -1 ? colors.D : colors.inner,
            position.z === 1 ? colors.F : colors.inner,
            position.z === -1 ? colors.B : colors.inner,
        ];
        return faceColors.map(color => new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.1 }));
    }, []); // Empty dependency array means this runs only once

    // This effect ensures the cubie is always in the correct position and rotation from the state
    useEffect(() => {
        if (meshRef.current) {
            meshRef.current.position.copy(position);
            meshRef.current.rotation.copy(rotation);
        }
    }, [position, rotation]);

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[1, 1, 1]} />
            {materials.map((mat, index) => (
                <primitive key={index} attach={`material-${index}`} object={mat} />
            ))}
            {/* This adds the edges to the cubie */}
            <Edges scale={1.001} threshold={15}>
                {/* --- FIX IS HERE: Ensured the color is explicitly black --- */}
                <lineBasicMaterial color="#000000" toneMapped={false} />
            </Edges>
        </mesh>
    );
};

// The main component that manages the state of all 26 cubies
const Cube = ({ animationSequence }) => {
    const animationQueue = useRef([]);
    const isAnimating = useRef(false);
    const currentMove = useRef(null);

    // This state is the single source of truth for the cube's configuration
    const [cubeState, setCubeState] = useState(() => {
        const initialState = [];
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    if (x === 0 && y === 0 && z === 0) continue;
                    initialState.push({
                        id: `${x}-${y}-${z}`, // A unique ID for each piece
                        position: new THREE.Vector3(x, y, z),
                        rotation: new THREE.Euler(0, 0, 0),
                    });
                }
            }
        }
        return initialState;
    });

    useEffect(() => {
        if (animationSequence && animationSequence.length > 0) {
            animationQueue.current.push(...animationSequence);
        }
    }, [animationSequence]);

    useFrame(() => {
        if (isAnimating.current && currentMove.current) {
            currentMove.current.progress = Math.min(1, currentMove.current.progress + 0.05);

            if (currentMove.current.progress >= 1) {
                isAnimating.current = false;
                setCubeState(currentMove.current.endState);
                currentMove.current = null;
            } else {
                const { startState, endState, progress } = currentMove.current;
                const animatingState = startState.map((startCubie, index) => {
                    const endCubie = endState[index];
                    const isMoving = !startCubie.position.equals(endCubie.position);

                    if (isMoving) {
                        const newPos = new THREE.Vector3().lerpVectors(startCubie.position, endCubie.position, progress);
                        const startQuat = new THREE.Quaternion().setFromEuler(startCubie.rotation);
                        const endQuat = new THREE.Quaternion().setFromEuler(endCubie.rotation);
                        const newRot = new THREE.Euler().setFromQuaternion(startQuat.slerp(endQuat, progress));
                        return { ...startCubie, position: newPos, rotation: newRot };
                    }
                    return startCubie;
                });
                setCubeState(animatingState);
            }
        } else if (animationQueue.current.length > 0) {
            const move = animationQueue.current.shift();
            performMove(move);
        }
    });

    const performMove = (move) => {
        const moveFace = move.charAt(0).toUpperCase();
        let angle = Math.PI / 2;
        if (move.includes("'")) angle = -angle;
        if (move.includes("2")) angle *= 2;

        const moveData = {
            'U': { axis: 'y', threshold: 0.5, rotationAngle: -angle },
            'D': { axis: 'y', threshold: -0.5, rotationAngle: angle },
            'R': { axis: 'x', threshold: 0.5, rotationAngle: -angle },
            'L': { axis: 'x', threshold: -0.5, rotationAngle: angle },
            'F': { axis: 'z', threshold: 0.5, rotationAngle: -angle },
            'B': { axis: 'z', threshold: -0.5, rotationAngle: angle },
        };

        const info = moveData[moveFace];
        if (!info) return;

        const startState = cubeState;
        const endState = startState.map(cubie => {
            const isMoving = info.threshold > 0 ? cubie.position[info.axis] > info.threshold : cubie.position[info.axis] < info.threshold;

            if (isMoving) {
                const newPosition = cubie.position.clone();
                const newRotation = cubie.rotation.clone();
                
                const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(
                    info.axis === 'x' ? info.rotationAngle : 0,
                    info.axis === 'y' ? info.rotationAngle : 0,
                    info.axis === 'z' ? info.rotationAngle : 0
                ));
                newPosition.applyMatrix4(rotationMatrix);

                const q = new THREE.Quaternion().setFromEuler(newRotation);
                const q_rot = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(
                    info.axis === 'x' ? 1 : 0, info.axis === 'y' ? 1 : 0, info.axis === 'z' ? 1 : 0
                ), info.rotationAngle);
                q.premultiply(q_rot);
                newRotation.setFromQuaternion(q);

                return { ...cubie, position: newPosition.round(), rotation: newRotation };
            }
            return cubie;
        });

        currentMove.current = { startState, endState, progress: 0 };
        isAnimating.current = true;
    };
    
    return (
        <group>
            {cubeState.map(state => (
                <Cubie key={state.id} position={state.position} rotation={state.rotation} />
            ))}
        </group>
    );
};

// The Canvas wrapper for the 3D scene
const Cube3D = ({ animationSequence }) => {
    return (
        <Canvas camera={{ position: [4.5, 4.5, 7], fov: 30 }}>
            <ambientLight intensity={2.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Cube animationSequence={animationSequence} />
            <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
    );
};

export default Cube3D;