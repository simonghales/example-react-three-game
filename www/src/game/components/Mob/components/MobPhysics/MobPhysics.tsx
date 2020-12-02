import React, {MutableRefObject, useCallback, useEffect} from "react";
import {Object3D} from "three";
import {useBody} from "../../../../../physics/components/Physics/hooks";
import {BodyShape, BodyType} from "../../../../../physics/bodies";
import {Vec2} from "planck-js";
import {COLLISION_FILTER_GROUPS} from "../../../../../physics/collisions/filters";
import {useFrame} from "react-three-fiber";
import {FixtureType} from "../../../../../physics/collisions/types";
import {updateMob} from "../../../../../temp/ai";
import {useMobBrain} from "../../hooks/brain";

const MobPhysics: React.FC<{
    x: number,
    y: number,
    id: number,
    localRef: MutableRefObject<Object3D>,
}> = ({x, y, id, localRef}) => {

    const onCollideStart = useCallback(({type}: any) => {
        if (type !== undefined && type === FixtureType.PLAYER_RANGE) {
            updateMob(id, {
                inPlayerRange: true,
            })
        }
    }, [id])

    const onCollideEnd = useCallback(({type}: any) => {
        if (type !== undefined && type === FixtureType.PLAYER_RANGE) {
            updateMob(id, {
                inPlayerRange: false,
            })
        }
    }, [id])

    const size = 0.75

    const [ref, api] = useBody(() => ({
        type: BodyType.dynamic,
        position: Vec2(x, y),
        fixtures: [{
            shape: BodyShape.circle,
            radius: size,
            fixtureOptions: {
                density: 35,
                isSensor: false,
                filterCategoryBits: COLLISION_FILTER_GROUPS.mob | COLLISION_FILTER_GROUPS.attackReceiver | COLLISION_FILTER_GROUPS.physical,
                userData: {
                    mobID: id,
                    type: FixtureType.MOB,
                }
            },
        }],
    }), {
        fwdRef: localRef,
        debug: 'mob',
        onCollideStart,
        onCollideEnd,
    })


    useMobBrain(id, api, ref)

    return null;
};

export default MobPhysics;