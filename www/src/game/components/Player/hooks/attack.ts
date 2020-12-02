import {useFrame} from "react-three-fiber";
import {proxy, useProxy} from "valtio";
import {InputKeys, inputsState} from "../../../../state/inputs";
import {playerPosition} from "../../../../state/positions";
import {playerState} from "../components/PlayerVisuals/PlayerVisuals";
import {playerTargets} from "../../../../state/player";
import {getMobHealthManager} from "../../../../state/mobs";

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
                    if (index === 0) {
                        playerTargets.lastAttacked = mobID
                    }
                    const manager = getMobHealthManager(mobID)
                    if (!manager) return
                    manager.health = manager.health - 25
                    manager.lastHit = Date.now()
                })
            }, 200)
        }
    }, )

}