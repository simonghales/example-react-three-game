import React, {MutableRefObject, Suspense, useCallback, useRef} from "react";
import Demon from "../../../../../3d/models/Demon/Demon";
import {Object3D} from "three";
import {useFrame} from "react-three-fiber";
import {playerPosition} from "../../../../../state/positions";
import {lerpRadians, PI, PI_TIMES_TWO} from "../../../../../utils/numbers";
import MobUI from "../MobUI/MobUI";
import {Cylinder} from "@react-three/drei";
import {playerTargets} from "../../../../../state/player";
import {MOB_VARIANT} from "../../data";

const MobVisuals: React.FC<{
    lastHit: number,
    lastAttacked: number,
    x: number,
    y: number,
    localRef: MutableRefObject<Object3D>,
    isDead: boolean,
    id: number,
    targeted: boolean,
    variant: MOB_VARIANT,
}> = ({localRef, variant, lastHit, lastAttacked, x, y, isDead, id, targeted}) => {

    const clickedTimestampsRef = useRef({
        lastClicked: 0,
    })

    const onClick = useCallback(() => {
        const now = Date.now()
        const lastClicked = clickedTimestampsRef.current.lastClicked

        if (lastClicked > now - 500) {
            playerTargets.lastAttacked = id
        }

        clickedTimestampsRef.current.lastClicked = now
    }, [id])

    useFrame((state, delta) => {
        if (isDead) return
        const targetX = playerPosition.x
        const targetY = playerPosition.y
        const x = localRef.current.position.x
        const y = localRef.current.position.z
        const angle = Math.atan2((targetX - x), (targetY - y))

        let prevAngle = localRef.current.rotation.y // convert to low equivalent angle
        if (prevAngle > PI) {
            prevAngle -= PI_TIMES_TWO
        }

        localRef.current.rotation.y = lerpRadians(prevAngle, angle, 2.5 * delta)
    })

    const scale = variant === MOB_VARIANT.large ? 2 : 0.75

    return (
        <group ref={localRef} position={[x, 0, y]}>
            <Suspense fallback={null}>
                <group scale={[scale, scale, scale]}>
                    <Demon isDead={isDead} lastHit={lastHit} lastAttacked={lastAttacked} position={[0, isDead ? 0 : 1, 0]} onClick={onClick}/>
                </group>
            </Suspense>
            {/*<Cylinder args={[0.75, 0.75]}>*/}
            {/*    <meshBasicMaterial attach="material" color={"purple"} transparent*/}
            {/*                       opacity={0.25}/>*/}
            {/*</Cylinder>*/}
            <MobUI id={id} variant={variant}/>
            <Cylinder visible={targeted}>
                <meshBasicMaterial attach="material" color={"black"} transparent
                                   opacity={0.25}/>
            </Cylinder>
        </group>
    );
};

export default MobVisuals;