export enum WorkerMessageType {
    INIT,
    STEP,
    ADD_BODY,
    REMOVE_BODY,
    SET_BODY,
    UPDATE_BODY,
}

export enum WorkerOwnerMessageType {
    FRAME,
    SYNC_BODIES,
    BEGIN_COLLISION,
    END_COLLISION,
}