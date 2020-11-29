import {Object3D} from "three";

export type Buffers = { positions: Float32Array; angles: Float32Array }

export const maxNumberOfDynamicPhysicObjects = 100

export const buffers = {
    positions: new Float32Array(maxNumberOfDynamicPhysicObjects * 2),
    angles: new Float32Array(maxNumberOfDynamicPhysicObjects),
}

export const collisionStartedEvents: {
    [key: string]: (data: any, fixtureIndex: number) => void,
} = {}

export const collisionEndedEvents: {
    [key: string]: (data: any, fixtureIndex: number) => void,
} = {}

export type CollisionEventProps = {
    uuid: string,
    fixtureIndex: number,
    data: {
        uuid: string,
    }
}

export const handleBeginCollision = (data: CollisionEventProps) => {
    if (collisionStartedEvents[data.uuid]) {
        collisionStartedEvents[data.uuid](data.data, data.fixtureIndex)
    }
}

export const handleEndCollision = (data: CollisionEventProps) => {
    if (collisionEndedEvents[data.uuid]) {
        collisionEndedEvents[data.uuid](data.data, data.fixtureIndex)
    }
}

export const storedPhysicsData: {
    bodies: {
        [uuid: string]: number,
    }
} = {
    bodies: {},
}

export const applyPositionAngle = (object: Object3D | null, index: number, applyAngle: boolean = false, debug?: string) => {
    if (index !== undefined && buffers.positions.length && !!object) {
        const start = index * 2
        const position = buffers.positions.slice(start, start + 2)
        object.position.x = position[0]
        object.position.z = position[1]
        if (debug) {
            // console.log('debug', debug, position)
        }
        if (applyAngle) {
            object.rotation.y = buffers.angles[index] * -1
        }
    } else {
        // console.warn('no match?')
    }
}