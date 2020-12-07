import {useFrame} from "react-three-fiber";
import {proxy, useProxy} from "valtio";
import {InputKeys, inputsState} from "../../../../state/inputs";
import {playerPosition} from "../../../../state/positions";
import {playerVisualState} from "../components/PlayerVisuals/PlayerVisuals";
import {playerTargets} from "../../../../state/player";
import {dealDamageToMob, getMobHealthManager} from "../../../../state/mobs";
import {getMobPosition} from "../../../../temp/ai";
import {attackBuffer, attackInputData} from "../../Game/components/AttackUIContainer/components/AttackUI/AttackUI";

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

const handleAttack = () => {

    const canAttack = !playerVisualState.rolling

    if (!canAttack) return

    attackState.lastAttack = Date.now()
    setTimeout(() => {
        const hasEnemies = playerTargets.attackRange.length > 0
        if (hasEnemies) {
            playerTargets.attackRange.forEach((mobID, index) => {
                dealDamageToMob(mobID, index === 0)
            })
        } else {
            attackInputData.nextAvailable = attackInputData.nextAvailable + 350
        }
    }, 200)

}

export const usePlayerAttackHandler = () => {

    useFrame(() => {
        if (attackBuffer.length > 0) {
            handleAttack()
            attackBuffer.length = 0
        } else if (inputsState[InputKeys.PUNCH].released) {
            handleAttack()
        }
    }, )

}