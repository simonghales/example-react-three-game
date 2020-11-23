import {useBody} from "../../../../physics/components/Physics/hooks";
import {BodyShape, BodyType} from "../../../../physics/bodies";
import {Vec2} from "planck-js";
import {useCallback} from "react";
import {useFrame} from "react-three-fiber";
import {COLLISION_FILTER_GROUPS} from "../../../../physics/collisions/filters";
import {devState} from "../../../../state/dev";
import {playerTargets} from "../../../../state/player";

const tempVec2 = Vec2(0, 0)

export const usePlayerPhysics = () => {

    const onCollideStart = useCallback(() => {
        // console.log('player collide start')
    }, [])

    const onCollideEnd = useCallback(() => {
        // console.log('player collide end')
    }, [])

    const onRadiusCollideStart = useCallback((data: any) => {
        const mobID = data.mobID
        playerTargets.targetID = mobID
        devState.targetLocked = true
    }, [])

    const onRadiusCollideEnd = useCallback(() => {
        devState.targetLocked = false
    }, [])

    const [ref, api] = useBody(() => ({
        type: BodyType.dynamic,
        shape: BodyShape.circle,
        radius: 0.75,
        position: Vec2(0, 0),
        fixtureOptions: {
            filterCategoryBits: COLLISION_FILTER_GROUPS.player,
        }
    }), {
        onCollideStart,
        onCollideEnd
    })

    const [radiusRef, radiusApi] = useBody(() => ({
        type: BodyType.dynamic,
        shape: BodyShape.circle,
        radius: 8,
        position: Vec2(0, 0),
        fixtureOptions: {
            isSensor: true,
            filterCategoryBits: COLLISION_FILTER_GROUPS.playerTrigger,
            filterMaskBits: COLLISION_FILTER_GROUPS.mob,
        }
    }), {
        onCollideStart: onRadiusCollideStart,
        onCollideEnd: onRadiusCollideEnd,
    })

    return [ref, api, radiusRef, radiusApi]

}