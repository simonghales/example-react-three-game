import React, {Suspense, useEffect, useRef} from "react";
import Male from "../../../3d/models/Character/Male";
import {nippleManager} from "../Joystick/Joystick";
import {useFrame} from "react-three-fiber";
import {proxy, useProxy} from "valtio";
import Warrior from "../../../3d/models/Warrior/Warrior";
import {radians} from "../../../utils/angles";
import {gameRefs} from "../../../state/refs";
import {usePlayerCamera} from "./hooks/camera";
import {playerPosition} from "../../../state/positions";
import {usePlayerControls} from "./hooks/controls";
import {InputKeys, inputsState} from "../../../state/inputs";
import {lerpRadians, numLerp, PI, PI_TIMES_TWO} from "../../../utils/numbers";
import {DIAGONAL} from "../../../utils/common";
import {devState} from "../../../state/dev";

const nippleState = {
    active: false,
}

const playerVelocity = {
    x: 0,
    y: 0,
    previousX: 0,
    previousY: 0,
    targetAngle: 0,
}

const playerState = proxy({
    moving: false,
    running: false,
})

const WALKING_SPEED = 5
const RUNNING_SPEED = WALKING_SPEED * 2

const Player: React.FC = () => {

    const ref = useRef<any>()
    usePlayerControls()
    const localPlayerState = useProxy(playerState)
    const localDevState = useProxy(devState)
    const targetLocked = localDevState.targetLocked

    useEffect(() => {
        gameRefs.player = ref.current
    }, [])

    useEffect(() => {

        nippleManager?.on("start", () => {
            nippleState.active = true
        })

        nippleManager?.on("end", () => {
            nippleState.active = false
            playerVelocity.previousX = 0
            playerVelocity.previousY = 0
            playerVelocity.x = 0
            playerVelocity.y = 0
        })

        nippleManager?.on("move", (_, data) => {
            const {x, y} = data.vector
            playerVelocity.previousX = playerVelocity.x
            playerVelocity.previousY = playerVelocity.y
            playerVelocity.x = x * -1
            playerVelocity.y = y
        })

    }, [])

    useFrame(({gl, scene, camera}, delta) => {
        if (!ref.current) return

        const {x, z: y} = ref.current.position

        let newX = x
        let newY = y

        let xVel = numLerp(playerVelocity.previousX, playerVelocity.x, 0.75)
        let yVel = numLerp(playerVelocity.previousY, playerVelocity.y, 0.75)

        if (!nippleState.active) {
            let up = inputsState[InputKeys.UP].active
            let right = inputsState[InputKeys.RIGHT].active
            let down = inputsState[InputKeys.DOWN].active
            let left = inputsState[InputKeys.LEFT].active
            xVel = left ? 1 : right ? -1 : 0
            yVel = up ? 1 : down ? -1 : 0

            if (xVel !== 0 && yVel !== 0) {
                xVel = xVel * DIAGONAL
                yVel = yVel * DIAGONAL
            }

        }

        const isMoving = xVel !== 0 || yVel !== 0
        const isRunning = inputsState[InputKeys.SHIFT].active

        if (isMoving) {

            let speed = isRunning ? RUNNING_SPEED : WALKING_SPEED
            newX = x + delta * xVel * speed
            newY = y + delta * yVel * speed
            ref.current.position.x = newX
            ref.current.position.z = newY
            playerPosition.x = newX
            playerPosition.y = newY
        }

        let prevAngle = ref.current.rotation.y // convert to low equivalent angle
        if (prevAngle > PI) {
            prevAngle -= PI_TIMES_TWO
        }

        const isTargetLocked = targetLocked

        if (isTargetLocked) {

            const targetX = playerPosition.targetX
            const targetY = playerPosition.targetY
            const angle = Math.atan2((targetX - newX), (targetY - newY))
            ref.current.rotation.y = lerpRadians(prevAngle, angle, 10 * delta)
            playerVelocity.targetAngle = angle
        } else {

            if (isMoving) {
                const angle = Math.atan2(-yVel, xVel) - radians(270)
                playerVelocity.targetAngle = angle
            }

            if (prevAngle !== playerVelocity.targetAngle) {
                ref.current.rotation.y = lerpRadians(prevAngle, playerVelocity.targetAngle, 10 * delta)
            }

        }

        if (playerState.moving !== isMoving) {
            playerState.moving = isMoving
        }

        if (playerState.running !== isRunning) {
            playerState.running = isRunning
        }

        playerPosition.previousX = x
        playerPosition.previousY = y

        gl.render(scene, camera)

    }, 100)

    return (
        <group position={[0, 0, 0]} ref={ref}>
            <Suspense fallback={null}>
                <Warrior moving={localPlayerState.moving} running={localPlayerState.running}/>
            </Suspense>
        </group>
    );
};

export default Player;