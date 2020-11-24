import React, {MutableRefObject} from "react";
import {Object3D} from "three";
import {Cylinder} from "@react-three/drei";
import {useProxy} from "valtio";
import {devState} from "../../../../../state/dev";

const PlayerDebug: React.FC<{
    radiusRef: MutableRefObject<Object3D>
}> = ({radiusRef}) => {

    const localDevState = useProxy(devState)
    const targetLocked = localDevState.targetLocked

    return null

    return (
        <Cylinder args={[8, 8, 0.5, 20]} ref={radiusRef}>
            <meshBasicMaterial attach="material" color={targetLocked ? "red" : "blue"} transparent
                               opacity={0.25}/>
        </Cylinder>
    );
};

export default PlayerDebug;