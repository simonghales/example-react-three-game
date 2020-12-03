import React, {Suspense, useCallback, useEffect, useRef} from "react";
import {nippleManager} from "../Joystick/Joystick";
import {useFrame} from "react-three-fiber";
import {radians} from "../../../utils/angles";
import {gameRefs} from "../../../state/refs";
import {playerPosition} from "../../../state/positions";
import {usePlayerControls} from "./hooks/controls";
import {InputKeys, inputsState} from "../../../state/inputs";
import {lerpRadians, numLerp, PI, PI_TIMES_TWO} from "../../../utils/numbers";
import {DIAGONAL} from "../../../utils/common";
import {Vec2} from "planck-js";
import {usePlayerPhysics} from "./hooks/physics";
import PlayerVisuals, {playerState} from "./components/PlayerVisuals/PlayerVisuals";
import PlayerDebug from "./components/PlayerDebug/PlayerDebug";
import {playerEnergy, usePlayerHasTarget} from "../../../state/player";
import {usePlayerCollisionsHandler} from "./hooks/collisions";
import {usePlayerEffectsHandler} from "./hooks/effects";

export const coroutine = (f: any, params = undefined) => {
    const o = f(params); // instantiate the coroutine
    return function (x: any) {
        return o.next(x);
    };
};

const rollCooldownCoroutine = function* () {
    let wait = Date.now() + 500;
    playerState.rollCooldown = true
    while (Date.now() < wait) {
        yield null;
    }
    playerState.rollCooldown = false
}

const rollCoroutine = function* () {
    let wait = Date.now() + 500;
    playerState.rolling = true
    while (Date.now() < wait) {
        yield null;
    }
    playerState.rolling = false
}

const rollManager: {
    rollCoroutine: any,
    cooldownCoroutine: any,
} = {
    rollCoroutine: null,
    cooldownCoroutine: null,
}

const nippleState = {
    active: false,
}

const playerLocalState = {
    xVelocity: 0,
    yVelocity: 0,
}

const playerJoystickVelocity = {
    x: 0,
    y: 0,
    previousX: 0,
    previousY: 0,
    targetAngle: 0,
}

const WALKING_SPEED = 5
const RUNNING_SPEED = WALKING_SPEED * 2
const ROLLING_SPEED = RUNNING_SPEED

const tempVec2 = Vec2(0, 0)

let thing = false

const Player: React.FC = () => {

    const [ref, api, largeColliderRef, largeColliderApi] = usePlayerPhysics()

    usePlayerCollisionsHandler(api)
    usePlayerControls()
    usePlayerEffectsHandler()
    const targetLocked = usePlayerHasTarget()

    useEffect(() => {
        gameRefs.player = ref.current
    }, [])

    useEffect(() => {

        nippleManager?.on("start", () => {
            nippleState.active = true
        })

        nippleManager?.on("end", () => {
            nippleState.active = false
            playerJoystickVelocity.previousX = 0
            playerJoystickVelocity.previousY = 0
            playerJoystickVelocity.x = 0
            playerJoystickVelocity.y = 0
        })

        nippleManager?.on("move", (_, data) => {
            const {x, y} = data.vector
            playerJoystickVelocity.previousX = playerJoystickVelocity.x
            playerJoystickVelocity.previousY = playerJoystickVelocity.y
            if (Math.abs(x) < 0.1 && Math.abs(y) < 0.1) {
                playerJoystickVelocity.x = 0
                playerJoystickVelocity.y = 0
                return
            }
            playerJoystickVelocity.x = x * -1
            playerJoystickVelocity.y = y
        })

    }, [])

    const applyVelocity = useCallback((x: number, y: number) => {
        tempVec2.set(x, y)
        api.setLinearVelocity(tempVec2)
        largeColliderApi.setLinearVelocity(tempVec2)
        playerLocalState.xVelocity = x
        playerLocalState.yVelocity = y
    }, [api, largeColliderApi])

    useFrame(({gl, scene, camera}, delta) => {
        if (!ref.current) return

        const {
            previousX,
            previousY
        } = playerPosition

        playerPosition.previousX = playerPosition.x
        playerPosition.previousY = playerPosition.y
        //largeColliderApi.setAngle(ref.current.rotation.y)

        const {x, z: y} = ref.current.position

        tempVec2.set(x, y)
        largeColliderApi.setPosition(tempVec2)

        let xVel = numLerp(playerJoystickVelocity.previousX, playerJoystickVelocity.x, 0.75)
        let yVel = numLerp(playerJoystickVelocity.previousY, playerJoystickVelocity.y, 0.75)
        let energy = playerEnergy.energy

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
        const isRunning = inputsState[InputKeys.SHIFT].active && !targetLocked && energy > 0

        if (!!rollManager.cooldownCoroutine) {
            if (rollManager.cooldownCoroutine().done) {
                rollManager.cooldownCoroutine = null
            }
        }

        const isRolling = inputsState[InputKeys.SHIFT].active && targetLocked && !playerState.rollCooldown && energy >= 33
        const ongoingRoll = !!rollManager.rollCoroutine

        if (ongoingRoll) {

            let speed = ROLLING_SPEED

            const adjustedXVel = xVel * speed
            const adjustedYVel = yVel * speed

            xVel = numLerp(playerLocalState.xVelocity, adjustedXVel, 0.1)
            yVel = numLerp(playerLocalState.yVelocity, adjustedYVel, 0.1)

            const response = rollManager.rollCoroutine()

            if (response.done) {
                rollManager.rollCoroutine = null
                rollManager.cooldownCoroutine = coroutine(rollCooldownCoroutine)
            }

            applyVelocity(xVel, yVel)

        } else if (isMoving) {

            let speed = isRolling ? ROLLING_SPEED : isRunning ? RUNNING_SPEED : WALKING_SPEED

            const adjustedXVel = xVel * speed
            const adjustedYVel = yVel * speed

            if (isRolling) {

                rollManager.rollCoroutine = coroutine(rollCoroutine)
                energy -= 33

            } else if (isRunning) {

                energy -= delta * 15

            }

            applyVelocity(adjustedXVel, adjustedYVel)
        } else {
            applyVelocity(0, 0)
        }

        let prevAngle = ref.current.rotation.y // convert to low equivalent angle
        if (prevAngle > PI) {
            prevAngle -= PI_TIMES_TWO
        }

        const isTargetLocked = targetLocked

        if (isTargetLocked && !ongoingRoll) {

            const targetX = playerPosition.targetX
            const targetY = playerPosition.targetY
            const angle = Math.atan2((targetX - x), (targetY - y))
            ref.current.rotation.y = lerpRadians(prevAngle, angle, 10 * delta)
            playerJoystickVelocity.targetAngle = angle
        } else {

            if (isMoving) {
                const angle = Math.atan2(-yVel, xVel) - radians(270)
                playerJoystickVelocity.targetAngle = angle
            }

            if (prevAngle !== playerJoystickVelocity.targetAngle) {
                ref.current.rotation.y = lerpRadians(prevAngle, playerJoystickVelocity.targetAngle, 10 * delta)
            }

        }

        if (playerState.moving !== isMoving) {
            playerState.moving = isMoving
        }

        if (playerState.running !== isRunning) {
            playerState.running = isRunning
        }

        if (energy < 0) {
            energy = 0
        }

        playerEnergy.energy = energy

        playerPosition.x = x
        playerPosition.y = y
        playerPosition.angle = ref.current.rotation.y

        largeColliderApi.setAngle(ref.current.rotation.y * -1)

        //console.log('angle', ref.current.rotation.y)

        gl.render(scene, camera)

    }, 100)

    return (
        <>
            <group position={[0, 0, 0]} ref={ref}>
                <PlayerVisuals/>
            </group>
            <PlayerDebug largeColliderRef={largeColliderRef}/>
        </>
    );
};

export default Player;