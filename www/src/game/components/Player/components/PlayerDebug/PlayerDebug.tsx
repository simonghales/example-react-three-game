import React, {MutableRefObject} from "react";
import {Object3D} from "three";
import {Cylinder} from "@react-three/drei";
import {useProxy} from "valtio";
import {devState} from "../../../../../state/dev";
import {largeColliderRadius, smallColliderRadius} from "../../hooks/physics";

const PlayerDebug: React.FC<{
    largeColliderRef: MutableRefObject<Object3D>,
    smallColliderRef: MutableRefObject<Object3D>,
}> = ({largeColliderRef, smallColliderRef}) => {

    return (
        <>
            <Cylinder args={[largeColliderRadius, largeColliderRadius, 0.5, 20]} ref={largeColliderRef}>
                <meshBasicMaterial attach="material" color={"blue"} transparent
                                   opacity={0.25}/>
            </Cylinder>
            <Cylinder args={[smallColliderRadius, smallColliderRadius, 0.52, 20]} ref={smallColliderRef}>
                <meshBasicMaterial attach="material" color={"blue"} transparent
                                   opacity={0.25}/>
            </Cylinder>
        </>
    );
};

export default PlayerDebug;