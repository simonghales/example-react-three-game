/*

each frame, iterate over active ai, process their goals

 */

export enum MobAIGoal {
    IDLE,
    ATTACK
}

export type MobData = {
    alive: boolean,
    inPlayerRange: boolean,
    goal: number,
    x: number,
    y: number,
}

export const mobsMap = new Map<number, MobData>()

export const addMob = (id: number) => {
    mobsMap.set(id, {
        alive: true,
        inPlayerRange: false,
        goal: MobAIGoal.IDLE,
        x: 0,
        y: 0,
    })
}

export const removeMob = (id: number) => {
    mobsMap.delete(id)
}

export const getMob = (id: number): MobData => {
    const mob = mobsMap.get(id)
    if (!mob) throw new Error(`Mob ${id} not found`)
    return mob
}

export const getMobPosition = (id: number): [number, number] => {
    const mob = getMob(id)
    return [mob.x, mob.y]
}

const processMob = (id: number, data: MobData) => {
    if (!data.alive) return
    if (data.inPlayerRange) {
        data.goal = MobAIGoal.ATTACK
    } else {
        data.goal = MobAIGoal.IDLE
    }
}

export const processMobsAI = () => {
    mobsMap.forEach((value, id) => {
        processMob(id, value)
    })
}

export const updateMob = (id: number, data: Partial<MobData>) => {
    const originalData = mobsMap.get(id)
    if (!originalData) return
    Object.entries(data).forEach(([key, value]) => {
        (originalData as any)[key] = value
    })
}