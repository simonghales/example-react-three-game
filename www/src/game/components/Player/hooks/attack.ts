import {useFrame} from "react-three-fiber";
import {proxy, useProxy} from "valtio";
import {InputKeys, inputsState} from "../../../../state/inputs";
import {playerPosition} from "../../../../state/positions";
import {playerVisualState} from "../components/PlayerVisuals/PlayerVisuals";
import {playerTargets} from "../../../../state/player";
import {dealDamageToMob, getMobHealthManager} from "../../../../state/mobs";
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

            const canAttack = !playerVisualState.rolling

            if (!canAttack) return

            attackState.lastAttack = Date.now()
            setTimeout(() => {
                playerTargets.attackRange.forEach((mobID, index) => {
                    dealDamageToMob(mobID, index === 0)
                })
            }, 200)
        }
    }, )

}