import React, {Suspense, useCallback, useEffect, useRef} from "react";
import {nippleManager} from "../Joystick/Joystick";
import {useFrame} from "react-three-fiber";
import {radians, rotateVector} from "../../../utils/angles";
import {gameRefs} from "../../../state/refs";
import {playerPosition} from "../../../state/positions";
import {usePlayerControls} from "./hooks/controls";
import {InputKeys, inputsState} from "../../../state/inputs";
import {lerpRadians, numLerp, PI, PI_TIMES_TWO} from "../../../utils/numbers";
import {DIAGONAL} from "../../../utils/common";
import {Vec2} from "planck-js";
import {usePlayerPhysics} from "./hooks/physics";
import PlayerVisuals, {playerVisualState} from "./components/PlayerVisuals/PlayerVisuals";
import PlayerDebug from "./components/PlayerDebug/PlayerDebug";
import {
    JUICE_RECHARGE_COST, playerCanRecharge,
    playerEnergy,
    playerJuice,
    playerState,
    rechargePlayer,
    usePlayerHasTarget,
    usePlayerInCombat
} from "../../../state/player";
import {usePlayerCollisionsHandler} from "./hooks/collisions";
import {usePlayerEffectsHandler} from "./hooks/effects";
import {usePlayerStateHandler} from "./hooks/state";
import PlayerUI from "./components/PlayerUI/PlayerUI";
import {attackInputData, attackStateProxy} from "../Game/components/AttackUIContainer/components/AttackUI/AttackUI";

export const coroutine = (f: any, params: any[] = []) => {
    const o = f(...params); // instantiate the coroutine
    return function (x: any) {
        return o.next(x);
    };
};

enum RechargeState {
    PENDING,
    ACTIVATED
}

const beginPreRechargeProcess = () => {
    playerState.preRecharging = true
}

const beginRechargeProcess = () => {
    playerState.recharging = true
}

const endRechargeProcess = () => {
    playerState.preRecharging = false
    playerState.recharging = false
}

const rechargeCoroutine = function* () {
    const start = Date.now()
    const wait = start + 500
    const completion = wait + 750
    beginPreRechargeProcess()
    let rechargePressed = true
    while (Date.now() < wait) {
        if (!rechargePressed || !playerState.preRecharging) {
            endRechargeProcess()
            return
        }
        rechargePressed = yield RechargeState.PENDING
    }
    beginRechargeProcess()
    while (Date.now() < completion) {
        yield RechargeState.ACTIVATED
    }
    rechargePlayer()
    endRechargeProcess()
}

const rollCooldownCoroutine = function* () {
    let wait = Date.now() + 500;
    playerVisualState.rollCooldown = true
    while (Date.now() < wait) {
        yield null;
    }
    playerVisualState.rollCooldown = false
}

const rollCoroutine = function* () {
    let wait = Date.now() + 500;
    playerVisualState.rolling = true
    while (Date.now() < wait) {
        yield null;
    }
    playerVisualState.rolling = false
}

const rechargeManager: {
    rechargeCoroutine: any,
} = {
    rechargeCoroutine: null,
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
    usePlayerStateHandler()
    const targetLocked = usePlayerHasTarget()
    const inCombat = usePlayerInCombat()

    useEffect(() => {
        gameRefs.player = ref.current
    }, [])

    useEffect(() => {

        nippleManager?.on("start", () => {
            console.log('normal start...')
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

        const [adjustedXVel, adjustedYVel] = rotateVector(xVel, yVel, -45)

        xVel = adjustedXVel
        yVel = adjustedYVel

        let rechargeAttempt = inputsState[InputKeys.RECHARGE].active && playerCanRecharge()
        let canMove = !rechargeAttempt
        let isRechargingActivated = false

        if (rechargeManager.rechargeCoroutine) {

            const rechargeResponse = rechargeManager.rechargeCoroutine(rechargeAttempt)

            if (rechargeResponse.done) {
                rechargeManager.rechargeCoroutine = null
            } else if (rechargeResponse.value === RechargeState.ACTIVATED) {
                isRechargingActivated = true
            }

        } else if (rechargeAttempt) {
            rechargeManager.rechargeCoroutine = coroutine(rechargeCoroutine)

        }

        if (isRechargingActivated) {
            xVel = 0
            yVel = 0
            canMove = false
        }

        const isMoving = canMove && (xVel !== 0 || yVel !== 0)
        const isRunning = canMove && inputsState[InputKeys.SHIFT].active && !inCombat && energy > 0

        if (!!rollManager.cooldownCoroutine) {
            if (rollManager.cooldownCoroutine().done) {
                rollManager.cooldownCoroutine = null
            }
        }

        const isRolling = canMove && inputsState[InputKeys.SHIFT].active && inCombat && !playerVisualState.rollCooldown && energy >= 33
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

                const energyUsed = delta * 15

                energy -= energyUsed

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

        const attackInputActive = attackStateProxy.attackEngaged

        const applyAttackAngle = () => {
            const [attackXVel, attackYVel] = rotateVector(attackInputData.xVel, attackInputData.yVel, -45)
            const angle = Math.atan2(-attackYVel, attackXVel) - radians(270)
            playerJoystickVelocity.targetAngle = angle

            if (prevAngle !== angle) {
                ref.current.rotation.y = lerpRadians(prevAngle, angle, 10 * delta)
            }
        }

        if (!ongoingRoll && (attackInputActive)) {

            applyAttackAngle()

        } else if (isTargetLocked && !ongoingRoll) {

            const targetX = playerPosition.targetX
            const targetY = playerPosition.targetY
            const angle = Math.atan2((targetX - x), (targetY - y))
            ref.current.rotation.y = lerpRadians(prevAngle, angle, 10 * delta)
            playerJoystickVelocity.targetAngle = angle

        } else if (!ongoingRoll && (attackInputData.lastReleased > Date.now() - 1000)) {

            applyAttackAngle()

        } else {

            if (isMoving) {
                const angle = Math.atan2(-yVel, xVel) - radians(270)
                playerJoystickVelocity.targetAngle = angle
            }

            if (prevAngle !== playerJoystickVelocity.targetAngle) {
                ref.current.rotation.y = lerpRadians(prevAngle, playerJoystickVelocity.targetAngle, 10 * delta)
            }

        }

        if (playerVisualState.moving !== isMoving) {
            playerVisualState.moving = isMoving
        }

        if (playerVisualState.running !== isRunning) {
            playerVisualState.running = isRunning
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
                <PlayerUI/>
            </group>
            <PlayerDebug largeColliderRef={largeColliderRef}/>
        </>
    );
};

export default Player;