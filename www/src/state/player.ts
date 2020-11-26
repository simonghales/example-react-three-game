import {proxy, useProxy} from "valtio";

export const playerTargets = proxy<{
    inRange: number[],
    targetID: number | null,
    lastAttacked: number | null,
}>({
    inRange: [],
    targetID: null,
    lastAttacked: null,
})

export const useEnemiesInRange = (): boolean => {
    const {inRange: targets} = useProxy(playerTargets)
    return targets.length > 0
}

export const usePlayerTarget = (): number | null => {
    const {inRange: targets, lastAttacked} = useProxy(playerTargets)
    if (lastAttacked !== null && targets.includes(lastAttacked)) {
        return lastAttacked
    }
    return null
    // return targets.length > 0 ? targets[0] : null
}

export const usePlayerHasTarget = (): boolean => {
    return usePlayerTarget() !== null
}

export const removePlayerTarget = (mobID: number) => {
    const index = playerTargets.inRange.indexOf(mobID)
    if (index >= 0) {
        playerTargets.inRange.splice(index, 1)
    }
}