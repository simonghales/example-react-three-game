import React, {MutableRefObject, useCallback} from "react";
import {Object3D} from "three";
import {useBody} from "../../../../../physics/components/Physics/hooks";
import {BodyShape, BodyType} from "../../../../../physics/bodies";
import {Vec2} from "planck-js";
import {COLLISION_FILTER_GROUPS} from "../../../../../physics/collisions/filters";
import {FixtureType} from "../../../../../physics/collisions/types";
import {updateMob} from "../../../../../temp/ai";
import {useMobBrain} from "../../hooks/brain";
import {MOB_VARIANT} from "../../data";

const MobPhysics: React.FC<{
    x: number,
    y: number,
    id: number,
    variant: MOB_VARIANT,
    localRef: MutableRefObject<Object3D>,
}> = ({x, y, id, localRef, variant}) => {

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
        linearDamping: variant === MOB_VARIANT.large ? 10 : 4,
        fixtures: [{
            shape: BodyShape.circle,
            radius: size * (variant === MOB_VARIANT.large ? 2 : 0.75),
            fixtureOptions: {
                density: variant === MOB_VARIANT.large ? 50 : 40,
                isSensor: false,
                filterCategoryBits: COLLISION_FILTER_GROUPS.mob | COLLISION_FILTER_GROUPS.attackReceiver | COLLISION_FILTER_GROUPS.physical,
                userData: {
                    mobID: id,
                    mobVariant: variant,
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


    useMobBrain(id, api, ref, variant)

    return null;
};

export default MobPhysics;