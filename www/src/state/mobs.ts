import {proxy} from "valtio";
import {increasePlayerJuice, playerTargets} from "./player";
import {getMobPosition} from "../temp/ai";
import {playerPosition} from "./positions";

export type MobHealth = {
    stunned: boolean,
    health: number,
    lastHit: number,
    lastAttacked: number,
    attackVector: [number, number]
}

export const mobsHealthManager: {
    [id: number]: MobHealth,
} = {}

export const initMobHealthManager = (id: number): MobHealth => {
    const manager = proxy<MobHealth>({
        stunned: false,
        health: 100,
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
    if (lockOn) {
        playerTargets.lastAttacked = mobID
    }
    manager.health = manager.health - 34
    manager.lastHit = Date.now()
    const [enemyX, enemyY] = getMobPosition(mobID)

    const angle = Math.atan2(playerPosition.y - enemyY, playerPosition.x - enemyX)
    const xVector = Math.cos(angle) * -1
    const yVector = Math.sin(angle) * -1
    manager.attackVector = [xVector, yVector]

    increasePlayerJuice(20)

}