import {useFrame} from "react-three-fiber";
import {proxy, useProxy} from "valtio";
import {InputKeys, inputsState} from "../../../../state/inputs";
import {playerPosition} from "../../../../state/positions";
import {playerState} from "../components/PlayerVisuals/PlayerVisuals";

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
                const {x, y, angle} = playerPosition
                const vX = Math.sin(angle)
                const vY = Math.cos(angle)
                const attackX = x + (vX * 1.25)
                const attackY = y + (vY * 1.25)
                attackCount += 1
                const id = attackCount
                attackColliders.colliders.push({
                    id,
                    x: attackX,
                    y: attackY,
                    vX,
                    vY,
                    expires: Date.now() + 100,
                })
            }, 200)
        }
    }, )

}