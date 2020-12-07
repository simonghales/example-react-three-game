import {useBody} from "../../../../physics/components/Physics/hooks";
import {BodyShape, BodyType} from "../../../../physics/bodies";
import {Vec2} from "planck-js";
import {useCallback} from "react";
import {COLLISION_FILTER_GROUPS} from "../../../../physics/collisions/filters";
import {
    addToPlayerAttackRange,
    addToPlayerCloseRange, addToPlayerFocusedRange,
    playerTargets, removeFromPlayerAttackRange,
    removeFromPlayerCloseRange, removeFromPlayerFocusedRange,
    removePlayerFromRange
} from "../../../../state/player";
import {FixtureType} from "../../../../physics/collisions/types";
import {MOB_VARIANT} from "../../Mob/data";

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
        const {mobID, type, mobVariant} = data
        if (type === FixtureType.MOB) {
            if (fixtureIndex === 0) {
                playerTargets.inRange.push(mobID)
                if (mobVariant === MOB_VARIANT.large) {
                    addToPlayerFocusedRange(mobID)
                }
            } else if (fixtureIndex === 1) {
                addToPlayerCloseRange(mobID)
            } else if (fixtureIndex === 2) {
                addToPlayerAttackRange(mobID)
            }
        }
    }, [])

    const onLargeCollideEnd = useCallback(({mobID, mobVariant}: {mobID: number, mobVariant: MOB_VARIANT}, fixtureIndex: number) => {
        if (fixtureIndex === 0) {
            if (mobVariant === MOB_VARIANT.large) {
                removeFromPlayerFocusedRange(mobID)
            }
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
        linearDamping: 4,
        fixtures: [{
            shape: BodyShape.circle,
            radius: 0.75,
            fixtureOptions: {
                density: 20,
                filterCategoryBits: COLLISION_FILTER_GROUPS.player | COLLISION_FILTER_GROUPS.physical,
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
                userData: {
                    type: FixtureType.PLAYER_RANGE,
                }
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