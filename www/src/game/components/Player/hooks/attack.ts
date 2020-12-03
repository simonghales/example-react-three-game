import {useFrame} from "react-three-fiber";
import {proxy, useProxy} from "valtio";
import {InputKeys, inputsState} from "../../../../state/inputs";
import {playerPosition} from "../../../../state/positions";
import {playerState} from "../components/PlayerVisuals/PlayerVisuals";
import {playerTargets} from "../../../../state/player";
import {getMobHealthManager} from "../../../../state/mobs";
import {getMobPosition} from "../../../../temp/ai";

let attackCount = 0

export const attackState = proxy({
    lastAttack: 0,
})

export type AttackCollider = {
    id: number,
    x: number,
    y: number,
    vX: number,
    vY: number,
    expires: number,
}

export const attackColliders = proxy<{
    colliders: AttackCollider[],
}>({
    colliders: [],
})

export const usePlayerAttackHandler = () => {

    useFrame(() => {
        if (inputsState[InputKeys.PUNCH].released) {

            const canAttack = !playerState.rolling

            if (!canAttack) return

            attackState.lastAttack = Date.now()
            setTimeout(() => {
                playerTargets.attackRange.forEach((mobID, index) => {
                    const manager = getMobHealthManager(mobID)
                    if (!manager) return
                    if (manager.stunned) return
                    if (index === 0) {
                        playerTargets.lastAttacked = mobID
                    }
                    manager.health = manager.health - 25
                    manager.lastHit = Date.now()
                    const [enemyX, enemyY] = getMobPosition(mobID)

                    const angle = Math.atan2(playerPosition.y - enemyY, playerPosition.x - enemyX)

                    const xVector = Math.cos(angle) * -1
                    const yVector = Math.sin(angle) * -1

                    manager.attackVector = [xVector, yVector]
                })
            }, 200)
        }
    }, )

}