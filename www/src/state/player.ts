import {proxy, useProxy} from "valtio";

export const playerEnergy = proxy<{
    energy: number,
}>({
    energy: 100,
})

export const playerHealth = proxy<{
    health: number,
    lastDamaged: number,
}>({
    health: 100,
    lastDamaged: 0,
})

export const playerTargets = proxy<{
    attackRange: number[],
    closeRange: number[],
    inRange: number[],
    targetID: number | null,
    lastAttacked: number | null,
    lastHitBy: number | null,
}>({
    attackRange: [],
    closeRange: [],
    inRange: [],
    targetID: null,
    lastAttacked: null,
    lastHitBy: null,
})

export const getPlayerTargetedEnemy = (): number | null => {
    const {lastAttacked, inRange} = playerTargets
    if (lastAttacked !== null && inRange.includes(lastAttacked)) {
        return lastAttacked
    }
    return null
}

export const useEnemiesInRange = (): boolean => {
    const {inRange: targets} = useProxy(playerTargets)
    return targets.length > 0
}

export const usePlayerTarget = (): number | null => {
    const {inRange, lastAttacked, attackRange, lastHitBy} = useProxy(playerTargets)
    if (lastAttacked !== null && inRange.includes(lastAttacked)) {
        return lastAttacked
    }
    if (lastHitBy !== null && inRange.includes(lastHitBy)) {
        return lastHitBy
    }
    if (attackRange.length > 0) {
        return attackRange[0]
    }
    return null
    // return targets.length > 0 ? targets[0] : null
}

export const usePlayerHasTarget = (): boolean => {
    const target = usePlayerTarget()
    console.log('target', target)
    return target !== null
}

export const removePlayerFromRange = (mobID: number) => {
    const index = playerTargets.inRange.indexOf(mobID)
    if (index >= 0) {
        playerTargets.inRange.splice(index, 1)
    }
}

export const addToPlayerCloseRange = (mobID: number) => {
    console.log('addToPlayerCloseRange', mobID)
    playerTargets.closeRange.push(mobID)
}

export const removeFromPlayerCloseRange = (mobID: number) => {
    console.log('removeFromPlayerCloseRange', mobID)
    const index = playerTargets.closeRange.indexOf(mobID)
    if (index >= 0) {
        playerTargets.closeRange.splice(index, 1)
    }
}

export const addToPlayerAttackRange = (mobID: number) => {
    playerTargets.attackRange.push(mobID)
}

export const removeFromPlayerAttackRange = (mobID: number) => {
    const index = playerTargets.attackRange.indexOf(mobID)
    if (index >= 0) {
        playerTargets.attackRange.splice(index, 1)
    }
}