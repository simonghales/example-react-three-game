import {useBody} from "../../../../physics/components/Physics/hooks";
import {BodyShape, BodyType} from "../../../../physics/bodies";
import {Vec2} from "planck-js";
import {useCallback} from "react";
import {COLLISION_FILTER_GROUPS} from "../../../../physics/collisions/filters";
import {
    addToPlayerAttackRange,
    addToPlayerCloseRange,
    playerTargets, removeFromPlayerAttackRange,
    removeFromPlayerCloseRange,
    removePlayerFromRange
} from "../../../../state/player";

export const largeColliderRadius = 12
export const smallColliderRadius = 4.5
export const boxSize = {
    width: 2.5,
    length: 2.2,
    offset: 1.1,
}

const tempVec2 = Vec2(0, 0)

export const usePlayerPhysics = () => {

    const onCollideStart = useCallback(() => {
        // console.log('player collide start')
    }, [])

    const onCollideEnd = useCallback(() => {
        // console.log('player collide end')
    }, [])

    const onLargeCollideStart = useCallback((data: any, fixtureIndex: number) => {
        const mobID = data.mobID
        if (fixtureIndex === 0) {
            playerTargets.inRange.push(mobID)
        } else if (fixtureIndex === 1) {
            addToPlayerCloseRange(mobID)
        } else if (fixtureIndex === 2) {
            addToPlayerAttackRange(mobID)
        }
    }, [])

    const onLargeCollideEnd = useCallback(({mobID}: {mobID: number}, fixtureIndex: number) => {
        if (fixtureIndex === 0) {
            removePlayerFromRange(mobID)
        } else if (fixtureIndex === 1) {
            removeFromPlayerCloseRange(mobID)
        } else if (fixtureIndex === 2) {
            removeFromPlayerAttackRange(mobID)
        }
    }, [])

    const [ref, api] = useBody(() => ({
        type: BodyType.dynamic,
        position: Vec2(0, 0),
        fixtures: [{
            shape: BodyShape.circle,
            radius: 0.75,
            fixtureOptions: {
                filterCategoryBits: COLLISION_FILTER_GROUPS.player,
            }
        }],
    }), {
        onCollideStart,
        onCollideEnd
    })

    const [largeColliderRef, largeColliderApi] = useBody(() => ({
        type: BodyType.dynamic,
        fixedRotation: false,
        position: Vec2(0, 0),
        fixtures: [
            {
            shape: BodyShape.circle,
            radius: largeColliderRadius,
            fixtureOptions: {
                isSensor: true,
                filterCategoryBits: COLLISION_FILTER_GROUPS.playerTrigger,
                filterMaskBits: COLLISION_FILTER_GROUPS.mob,
            },
        }, {
            shape: BodyShape.circle,
            radius: smallColliderRadius,
            fixtureOptions: {
                isSensor: true,
                filterCategoryBits: COLLISION_FILTER_GROUPS.playerTrigger,
                filterMaskBits: COLLISION_FILTER_GROUPS.mob,
            },
        }, {
            shape: BodyShape.box,
            hx: boxSize.width,
            hy: boxSize.length,
            center: [0, boxSize.offset],
            fixtureOptions: {
                isSensor: true,
                filterCategoryBits: COLLISION_FILTER_GROUPS.playerTrigger,
                filterMaskBits: COLLISION_FILTER_GROUPS.mob,
            },
        }],
    }), {
        applyAngle: true,
        onCollideStart: onLargeCollideStart,
        onCollideEnd: onLargeCollideEnd,
    })

    return [ref, api, largeColliderRef, largeColliderApi]

}