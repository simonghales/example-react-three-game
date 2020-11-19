
export type InputState = {
    keys: number[],
    active: boolean,
    pressed: boolean,
    released: boolean,
}

export enum InputKeys {
    RIGHT,
    LEFT,
    UP,
    DOWN,
    SHIFT
}

export const inputsState: Record<InputKeys, InputState> = {
    [InputKeys.RIGHT]: {
        keys: [68, 39],
        active: false,
        pressed: false,
        released: false,
    },
    [InputKeys.LEFT]: {
        keys: [65, 37],
        active: false,
        pressed: false,
        released: false,
    },
    [InputKeys.UP]: {
        keys: [87, 38],
        active: false,
        pressed: false,
        released: false,
    },
    [InputKeys.DOWN]: {
        keys: [83, 40],
        active: false,
        pressed: false,
        released: false,
    },
    [InputKeys.SHIFT]: {
        keys: [16],
        active: false,
        pressed: false,
        released: false,
    },
}