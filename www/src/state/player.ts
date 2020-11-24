import {proxy} from "valtio";

export const playerTargets = proxy<{
    inRange: number[],
    targetID: number | undefined,
}>({
    inRange: [],
    targetID: undefined,
})

export const removePlayerTarget = (mobID: number) => {
    const index = playerTargets.inRange.indexOf(mobID)
    if (index >= 0) {
        playerTargets.inRange.splice(index, 1)
    }
}