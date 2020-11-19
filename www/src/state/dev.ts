import {proxy} from "valtio";

export const devState = proxy({
    targetLocked: true,
})