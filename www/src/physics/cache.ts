import {Body} from "planck-js";

export enum PhysicsCacheKeys {
    PUNCH = 'PUNCH'
}

export const cachedBodies: {
    [key: string]: Body[],
} = {}

export const getCachedBody = (key: PhysicsCacheKeys): Body | null => {
    const bodies = cachedBodies[key]
    if (bodies && bodies.length > 0) {
        const body = bodies.pop()
        if (body) {
            return body
        }
    }
    return null
}

export const addCachedBody = (key: PhysicsCacheKeys, body: Body) => {
    if (cachedBodies[key]) {
        cachedBodies[key].push(body)
    } else {
        cachedBodies[key] = [body]
    }
}