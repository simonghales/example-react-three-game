import React, {MutableRefObject, useEffect} from "react";
import {Object3D} from "three";
import {useBody} from "../../../../../physics/components/Physics/hooks";
import {BodyShape, BodyType} from "../../../../../physics/bodies";
import {Vec2} from "planck-js";
import {COLLISION_FILTER_GROUPS} from "../../../../../physics/collisions/filters";
import {useFrame} from "react-three-fiber";

const MobPhysics: React.FC<{
    x: number,
    y: number,
    id: number,
    localRef: MutableRefObject<Object3D>,
}> = ({x, y, id, localRef}) => {

    const size = 0.75

    const [ref, api] = useBody(() => ({
        type: BodyType.static,
        position: Vec2(x, y),
        fixtures: [{
            shape: BodyShape.circle,
            radius: size,
            fixtureOptions: {
                restitution: 0,
                friction: 1,
                density: 200,
                isSensor: false,
                filterCategoryBits: COLLISION_FILTER_GROUPS.mob | COLLISION_FILTER_GROUPS.attackReceiver,
                userData: {
                    mobID: id,
                }
            },
        }],
    }), {
        fwdRef: localRef,
        debug: 'mob'
    })

    useFrame(() => {
        // console.log('ref', ref.current.position.x)
    })

    return null;
};

export default MobPhysics;