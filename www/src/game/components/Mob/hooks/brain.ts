import {useFrame} from "react-three-fiber";
import {useEffect, useState} from "react";
import {getMob, MobAIGoal} from "../../../../temp/ai";
import {BodyApi} from "../../../../physics/components/Physics/hooks";
import {playerPosition} from "../../../../state/positions";
import {Vec2} from "planck-js";
import {useProxy} from "valtio";
import {getMobHealthManager} from "../../../../state/mobs";

const velocity = Vec2(0, 0)

export const useMobBrain = (id: number, api: BodyApi, ref: any) => {
    const [manager] = useState(() => getMobHealthManager(id))
    const managerProxy = useProxy(manager)

    const {lastHit} = managerProxy

    const [previousVelocities] = useState(() => ({
        xVel: 0,
        yVel: 0,
    }))
    const [mobData] = useState(() => getMob(id))

    useFrame(() => {

        let xVel = 0
        let yVel = 0

        if (manager.stunned) {

            xVel = manager.attackVector[0] * 7.5
            yVel = manager.attackVector[1] * 7.5

        } else {

            if (mobData.goal === MobAIGoal.ATTACK) {

                const x = ref.current.position.x
                const y = ref.current.position.z

                const xDistance = x - playerPosition.x
                const yDistance = y - playerPosition.y

                if (Math.abs(xDistance) <= 2 && Math.abs(yDistance) <= 2) {
                    // console.log('attack!')
                } else {
                    if (x > playerPosition.x) {
                        xVel = -1.25
                    } else if (x < playerPosition.x) {
                        xVel = 1.25
                    }
                    if (y > playerPosition.y) {
                        yVel = -1.25
                    } else if (y < playerPosition.y) {
                        yVel = 1.25
                    }
                }

            } else if (mobData.goal === MobAIGoal.IDLE) {
                // return to original position
            }

        }

        if (previousVelocities.xVel !== xVel || previousVelocities.yVel !== yVel) {
            velocity.set(xVel, yVel)
            api.setLinearVelocity(velocity)
            previousVelocities.xVel = xVel
            previousVelocities.yVel = yVel
        }

        mobData.x = ref.current.position.x
        mobData.y = ref.current.position.z

    })

    useEffect(() => {

        if (lastHit > 0) {

            const expires = 150 - (Date.now() - lastHit)

            if (expires <= 0) return

            manager.stunned = true
            // init a coroutine for backwards velocity movement?

            let timeout = setTimeout(() => {
                manager.stunned = false
            }, expires)

            return () => {
                clearTimeout(timeout)
            }

        }

    }, [lastHit])

}