import {proxy} from "valtio";

export const devState = proxy({
    targetLocked: false,
    inDanger: false,
})