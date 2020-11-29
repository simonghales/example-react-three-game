import React, {MutableRefObject, Suspense} from "react";
import Demon from "../../../../../3d/models/Demon/Demon";
import {radians} from "../../../../../utils/angles";
import {Object3D} from "three";
import {useFrame} from "react-three-fiber";
import {playerPosition} from "../../../../../state/positions";
import {lerpRadians, PI, PI_TIMES_TWO} from "../../../../../utils/numbers";
import MobUI from "../MobUI/MobUI";
import {Cylinder} from "@react-three/drei";

const MobVisuals: React.FC<{
    lastHit: number,
    x: number,
    y: number,
    localRef: MutableRefObject<Object3D>,
    isDead: boolean,
    id: number,
    targeted: boolean,
}> = ({localRef, lastHit, x, y, isDead, id, targeted}) => {

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

    return (
        <group ref={localRef} position={[x, 0, y]}>
            <Suspense fallback={null}>
                <Demon isDead={isDead} lastHit={lastHit} position={[0, isDead ? 0 : 1, 0]} onClick={() => console.log('clicked on mesh')}/>
            </Suspense>
            <Cylinder args={[0.75, 0.75]}>
                <meshBasicMaterial attach="material" color={"purple"} transparent
                                   opacity={0.25}/>
            </Cylinder>
            <MobUI id={id}/>
            {
                targeted && (
                    <Cylinder>
                        <meshBasicMaterial attach="material" color={"red"} transparent
                                           opacity={0.25}/>
                    </Cylinder>
                )
            }
        </group>
    );
};

export default MobVisuals;