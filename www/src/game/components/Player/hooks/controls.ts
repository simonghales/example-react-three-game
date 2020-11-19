import {useEffect} from "react";
import hotkeys from "hotkeys-js";
import {useFrame} from "react-three-fiber";
import {inputsState} from "../../../../state/inputs";

export const usePlayerControls = () => {

    const inputs = Object.values(inputsState)

    useEffect(() => {
        hotkeys('*', '', () => {})
    }, [])

    useFrame(() => {

        inputs.forEach(inputState => {
            let pressed = false
            inputState.keys.forEach(key => {
                if (!pressed && hotkeys.isPressed(key)) {
                    pressed = true
                }
                if (pressed) {
                    if (!inputState.active) {
                        inputState.active = true
                        inputState.pressed = true
                        inputState.released = false
                    } else if (inputState.pressed) {
                        inputState.pressed = false
                    }
                } else {
                    if (inputState.active) {
                        inputState.active = false
                        inputState.pressed = false
                        inputState.released = true
                    } else if (inputState.released) {
                        inputState.released = false
                    }
                }
            })
        })

    }, 1)

}