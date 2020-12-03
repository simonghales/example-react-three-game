import React, {MutableRefObject, useEffect} from "react";
import {Object3D} from "three";
import {useFrame} from "react-three-fiber";
import {playerPosition} from "../../../../../state/positions";

const MobTargetTracking: React.FC<{
    localRef: MutableRefObject<Object3D>
}> = ({localRef}) => {

    useFrame(() => {
        playerPosition.targetX = localRef.current.position.x
        playerPosition.targetY = localRef.current.position.z
    })

    return null;
};

export default MobTargetTracking;