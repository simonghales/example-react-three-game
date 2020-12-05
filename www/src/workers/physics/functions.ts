import {WorkerOwnerMessageType} from "./types";
import {dynamicBodiesUuids, updateBodiesLastUpdated} from "../../shared";

/* eslint-disable-next-line no-restricted-globals */
const selfWorker = self as unknown as Worker

export const syncBodies = () => {
    updateBodiesLastUpdated()
    /*selfWorker.postMessage(({
        type: WorkerOwnerMessageType.SYNC_BODIES,
        bodies: dynamicBodiesUuids
    }))*/
}

export const sendCollisionBeginEvent = (uuid: string, data: any, fixtureIndex: number) => {
    selfWorker.postMessage(({
        type: WorkerOwnerMessageType.BEGIN_COLLISION,
        props: {
            uuid,
            data,
            fixtureIndex,
        }
    }))
}

export const sendCollisionEndEvent = (uuid: string, data: any, fixtureIndex: number) => {
    selfWorker.postMessage(({
        type: WorkerOwnerMessageType.END_COLLISION,
        props: {
            uuid,
            data,
            fixtureIndex,
        }
    }))
}