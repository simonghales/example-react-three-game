import React, {MutableRefObject} from "react";
import {Object3D} from "three";
import {Box, Cylinder} from "@react-three/drei";
import {useProxy} from "valtio";
import {devState} from "../../../../../state/dev";
import {boxSize, largeColliderRadius, smallColliderRadius} from "../../hooks/physics";
import {radians} from "../../../../../utils/angles";

const PlayerDebug: React.FC<{
    largeColliderRef: MutableRefObject<Object3D>,
}> = ({largeColliderRef}) => {

    return null

    return (
        <group ref={largeColliderRef}>
            <Cylinder args={[largeColliderRadius, largeColliderRadius, 0.5, 20]}>
                <meshBasicMaterial attach="material" color={"blue"} transparent
                                   opacity={0.25}/>
            </Cylinder>
            <Cylinder args={[smallColliderRadius, smallColliderRadius, 0.52, 20]}>
                <meshBasicMaterial attach="material" color={"blue"} transparent
                                   opacity={0.25}/>
            </Cylinder>
            <Box args={[boxSize.width, 1, boxSize.length]} position={[0, 0.005, boxSize.offset]} rotation={[0, radians(0), 0]}>
                <meshBasicMaterial attach="material" color={"green"} transparent
                                   opacity={0.25}/>
            </Box>
        </group>
    );
};

export default PlayerDebug;