import {useFrame} from "react-three-fiber";
import {useEffect, useState} from "react";
import {getMob, MobAIGoal} from "../../../../temp/ai";
import {BodyApi} from "../../../../physics/components/Physics/hooks";
import {playerPosition} from "../../../../state/positions";
import {Vec2} from "planck-js";
import {useProxy} from "valtio";
import {getMobHealthManager} from "../../../../state/mobs";
import {playerHealth} from "../../../../state/player";
import {coroutine} from "../../Player/Player";

const attackPlayerCoroutine = function* () {

    const started = Date.now()

    // wait 100ms
    while (started > Date.now() - 100) {
        yield null
    }

    if (started > Date.now() + 200) {
        // too old, ignore
    } else {
        let newPlayerHealth = playerHealth.health - 5
        if (newPlayerHealth < 0) {
            newPlayerHealth = 0
        }
        playerHealth.health = newPlayerHealth
        playerHealth.lastDamaged = Date.now()
    }

}

const velocity = Vec2(0, 0)
const position = Vec2(0, 0)

export const useMobBrain = (id: number, api: BodyApi, ref: any) => {
    const [coroutineManager] = useState<{
        attack: any,
    }>(() => ({
        attack: null,
    }))
    const [hits] = useState<{
        [id: number]: boolean,
    }>(() => ({}))
    const [manager] = useState(() => getMobHealthManager(id))
    const managerProxy = useProxy(manager)

    const {lastHit} = managerProxy

    const [previousVelocities] = useState(() => ({
        xVel: 0,
        yVel: 0,
    }))
    const [mobData] = useState(() => getMob(id))

    useFrame((state, delta) => {

        let xVel = 0
        let yVel = 0

        const x = ref.current.position.x
        const y = ref.current.position.z

        const now = Date.now()

        if (manager.stunned && !hits[manager.lastHit]) {

            velocity.set(manager.attackVector[0] * 150,  manager.attackVector[1] * 150)
            // api.applyForceToCenter(velocity)
            position.set(x, y)
            api.applyLinearImpulse(velocity, position)
            hits[manager.lastHit] = true

        } else if (manager.lastHit > now - 500) {

            // do nothing...

        } else {

            if (mobData.goal === MobAIGoal.ATTACK) {

                const xDistance = x - playerPosition.x
                const yDistance = y - playerPosition.y

                if (Math.abs(xDistance) <= 2 && Math.abs(yDistance) <= 2) {

                    if (manager.lastAttacked < now - 1500) {

                        manager.lastAttacked = now

                        coroutineManager.attack = coroutine(attackPlayerCoroutine)

                    }

                    if (coroutineManager.attack) {

                        const response = coroutineManager.attack()

                        if (response.done) {
                            coroutineManager.attack = null
                        }

                    }

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

        // if (previousVelocities.xVel !== xVel || previousVelocities.yVel !== yVel) {
            velocity.set(xVel * 300, yVel * 300)
            api.applyForceToCenter(velocity)
            // api.setLinearVelocity(velocity)
            previousVelocities.xVel = xVel
            previousVelocities.yVel = yVel
        // }

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