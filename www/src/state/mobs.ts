import {proxy} from "valtio";
import {increasePlayerJuice, playerTargets} from "./player";
import {getMobPosition} from "../temp/ai";
import {playerPosition} from "./positions";
import {MOB_VARIANT} from "../game/components/Mob/data";

const getMobVariantHealth = (variant: MOB_VARIANT): {
    health: number,
    maxHealth: number,
} => {

    if (variant === MOB_VARIANT.large) {
        return {
            health: 250,
            maxHealth: 250,
        }
    }

    return {
        health: 100,
        maxHealth: 100,
    }
}

export type MobHealth = {
    stunned: boolean,
    health: number,
    maxHealth: number,
    lastHit: number,
    lastAttacked: number,
    attackVector: [number, number]
}

export const mobsHealthManager: {
    [id: number]: MobHealth,
} = {}

export const initMobHealthManager = (id: number, variant: MOB_VARIANT): MobHealth => {

    const {health, maxHealth} = getMobVariantHealth(variant)

    const manager = proxy<MobHealth>({
        stunned: false,
        health,
        maxHealth,
        lastHit: 0,
        lastAttacked: 0,
        attackVector: [0, 0]
    })
    mobsHealthManager[id] = manager
    return manager
}

export const deleteMobHealthManager = (id: number) => {
    delete mobsHealthManager[id]
}

export const getMobHealthManager = (id: number): MobHealth => {
    const manager = mobsHealthManager[id]
    if (!manager) throw new Error(`Mob manager to available: ${id}`)
    return manager
}

export const dealDamageToMob = (mobID: number, lockOn: boolean) => {
    const manager = getMobHealthManager(mobID)
    if (!manager) return
    if (manager.stunned) return
    // if (lockOn) {
    //     playerTargets.lastAttacked = mobID
    // }
    //let newHealth = manager.health - 34
    let newHealth = manager.health - 34
    if (newHealth < 0) {
        newHealth = 0
    }
    manager.health = newHealth
    //manager.health = manager.health - 1
    manager.lastHit = Date.now()
    const [enemyX, enemyY] = getMobPosition(mobID)

    const angle = Math.atan2(playerPosition.y - enemyY, playerPosition.x - enemyX)
    const xVector = Math.cos(angle) * -1
    const yVector = Math.sin(angle) * -1
    manager.attackVector = [xVector, yVector]

    increasePlayerJuice(20)

}