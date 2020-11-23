import React, {Suspense, useCallback, useEffect, useRef} from "react";
import {nippleManager} from "../Joystick/Joystick";
import {useFrame} from "react-three-fiber";
import {proxy, useProxy} from "valtio";
import {radians} from "../../../utils/angles";
import {gameRefs} from "../../../state/refs";
import {usePlayerCamera} from "./hooks/camera";
import {playerPosition} from "../../../state/positions";
import {usePlayerControls} from "./hooks/controls";
import {InputKeys, inputsState} from "../../../state/inputs";
import {lerpRadians, numLerp, PI, PI_TIMES_TWO} from "../../../utils/numbers";
import {DIAGONAL} from "../../../utils/common";
import {devState} from "../../../state/dev";
import {Vec2} from "planck-js";
import {usePlayerPhysics} from "./hooks/physics";
import PlayerVisuals, {playerState} from "./components/PlayerVisuals/PlayerVisuals";
import PlayerDebug from "./components/PlayerDebug/PlayerDebug";

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

const WALKING_SPEED = 5
const RUNNING_SPEED = WALKING_SPEED * 2

const tempVec2 = Vec2(0, 0)

const Player: React.FC = () => {

    const [ref, api, radiusRef, radiusApi] = usePlayerPhysics()

    usePlayerControls()
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

        const {
            previousX,
            previousY
        } = playerPosition

        playerPosition.previousX = playerPosition.x
        playerPosition.previousY = playerPosition.y

        const {x, z: y} = ref.current.position

        tempVec2.set(x, y)
        radiusApi.setPosition(tempVec2)

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

            const adjustedXVel = xVel * speed
            const adjustedYVel = yVel * speed

            tempVec2.set(adjustedXVel, adjustedYVel)
            api.setLinearVelocity(tempVec2)
            radiusApi.setLinearVelocity(tempVec2)
        } else {
            tempVec2.set(0, 0)
            api.setLinearVelocity(tempVec2)
            radiusApi.setLinearVelocity(tempVec2)
        }

        let prevAngle = ref.current.rotation.y // convert to low equivalent angle
        if (prevAngle > PI) {
            prevAngle -= PI_TIMES_TWO
        }

        const isTargetLocked = targetLocked

        if (isTargetLocked) {

            const targetX = playerPosition.targetX
            const targetY = playerPosition.targetY
            const angle = Math.atan2((targetX - x), (targetY - y))
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

        playerPosition.x = x
        playerPosition.y = y
        playerPosition.angle = ref.current.rotation.y

        gl.render(scene, camera)

    }, 100)

    return (
        <>
            <group position={[0, 0, 0]} ref={ref}>
                <PlayerVisuals/>
            </group>
            <PlayerDebug radiusRef={radiusRef}/>
        </>
    );
};

export default Player;