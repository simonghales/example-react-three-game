import {proxy, useProxy} from "valtio";

export const playerJuice = proxy<{
    juice: number,
}>({
    juice: 100,
})

export const increasePlayerJuice = (juice: number) => {
    const currentJuice = playerJuice.juice
    if (currentJuice >= 100) return
    let newJuice = currentJuice + juice
    if (newJuice > 100) {
        newJuice = 100
    }
    playerJuice.juice = newJuice
}

export const playerState = proxy<{
    invincible: boolean,
    preRecharging: boolean,
    recharging: boolean,
}>({
    invincible: false,
    preRecharging: false,
    recharging: false,
})

export const playerEnergy = proxy<{
    energy: number,
}>({
    energy: 50,
})

export const playerHealth = proxy<{
    maxHealth: number,
    health: number,
    lastDamaged: number,
}>({
    maxHealth: 4,
    health: 3.5,
    lastDamaged: 0,
})

export const playerHasFullHealth = (): boolean => {
    return playerHealth.health >= playerHealth.maxHealth
}

export const JUICE_RECHARGE_COST = 50

export const playerCanRecharge = (): boolean => {
    return playerJuice.juice >= JUICE_RECHARGE_COST && !playerHasFullHealth()
}

export const usePlayerCanRecharge = (): boolean => {
    const {juice} = useProxy(playerJuice)
    const {health, maxHealth} = useProxy(playerHealth)
    return juice >= JUICE_RECHARGE_COST && health < maxHealth
}

export const rechargePlayer = () => {
    if (playerHealth.health >= playerHealth.maxHealth) {
        console.warn(`Player health already full.`)
        return
    }
    if (!playerCanRecharge()) {
        console.warn(`Can't recharge the player, there's no juice.`)
        return
    }
    let newJuice = playerJuice.juice - JUICE_RECHARGE_COST
    if (newJuice < 0) {
        newJuice = 0
    }
    playerJuice.juice = newJuice
    let newHealth = playerHealth.health + 1
    if (newHealth > playerHealth.maxHealth) {
        newHealth = playerHealth.maxHealth
    }
    playerHealth.health = newHealth
}

export const dealPlayerDamage = (damage: number) => {
    if (playerState.invincible) {
        return
    }
    let newPlayerHealth = playerHealth.health - damage
    if (newPlayerHealth < 0) {
        newPlayerHealth = 0
    }
    playerHealth.health = newPlayerHealth
    playerHealth.lastDamaged = Date.now()
    playerState.preRecharging = false
}

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
}

export const usePlayerHasTarget = (): boolean => {
    const target = usePlayerTarget()
    return target !== null
}

export const usePlayerInCombat = (): boolean => {
    const target = usePlayerTarget()
    const {closeRange} = useProxy(playerTargets)
    return target !== null || closeRange.length > 0
}

export const removePlayerFromRange = (mobID: number) => {
    const index = playerTargets.inRange.indexOf(mobID)
    if (index >= 0) {
        playerTargets.inRange.splice(index, 1)
    }
}

export const addToPlayerCloseRange = (mobID: number) => {
    playerTargets.closeRange.push(mobID)
}

export const removeFromPlayerCloseRange = (mobID: number) => {
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