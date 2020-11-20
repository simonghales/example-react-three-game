import {WorkerOwnerMessageType} from "./types";
import {dynamicBodiesUuids} from "../../shared";

/* eslint-disable-next-line no-restricted-globals */
const selfWorker = self as unknown as Worker

export const syncBodies = () => {
    selfWorker.postMessage(({
        type: WorkerOwnerMessageType.SYNC_BODIES,
        bodies: dynamicBodiesUuids
    }))
}

export const sendCollisionBeginEvent = (uuid: string, data: any) => {
    selfWorker.postMessage(({
        type: WorkerOwnerMessageType.BEGIN_COLLISION,
        props: {
            uuid,
            data,
        }
    }))
}

export const sendCollisionEndEvent = (uuid: string, data: any) => {
    selfWorker.postMessage(({
        type: WorkerOwnerMessageType.END_COLLISION,
        props: {
            uuid,
            data,
        }
    }))
}