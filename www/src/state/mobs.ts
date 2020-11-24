import {proxy} from "valtio";

export type MobHealth = {
    health: number,
}

export const mobsHealthManager: {
    [id: number]: MobHealth,
} = {}

export const initMobHealthManager = (id: number): MobHealth => {
    const manager = proxy<MobHealth>({
        health: 100,
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