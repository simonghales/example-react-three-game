import React, {Suspense, useEffect, useRef} from "react";
import Male from "../../../3d/models/Character/Male";
import {nippleManager} from "../Joystick/Joystick";
import {useFrame} from "react-three-fiber";
import {proxy, useProxy} from "valtio";
import Warrior from "../../../3d/models/Warrior/Warrior";
import {radians} from "../../../utils/angles";
import {gameRefs} from "../../../state/refs";
import {usePlayerCamera} from "./hooks/camera";

const playerVelocity = {
    x: 0,
    y: 0,
}

const playerState = proxy({
    moving: false,
})

const speed = 5

const Player: React.FC = () => {

    const ref = useRef<any>()
    usePlayerCamera(ref)
    const localPlayerState = useProxy(playerState)

    useEffect(() => {
        gameRefs.player = ref.current
    }, [])

    useEffect(() => {

        nippleManager?.on("start", () => {
        })

        nippleManager?.on("end", () => {
            playerVelocity.x = 0
            playerVelocity.y = 0
        })

        nippleManager?.on("move", (_, data) => {
            const {x, y} = data.vector
            playerVelocity.x = x * -1
            playerVelocity.y = y
        })

    }, [])

    useFrame((state, delta) => {
        if (!ref.current) return

        const isMoving = playerVelocity.x !== 0 || playerVelocity.y !== 0

        ref.current.position.x += delta * playerVelocity.x * speed
        ref.current.position.z += delta * playerVelocity.y * speed

        if (isMoving) {
            const angle = Math.atan2(-playerVelocity.y, playerVelocity.x) - radians(270)
            ref.current.rotation.y = angle
        }

        if (playerState.moving !== isMoving) {
            playerState.moving = isMoving
        }

    })

    return (
        <group position={[0, 0, 0]} ref={ref}>
            <Suspense fallback={null}>
                <Warrior moving={localPlayerState.moving}/>
            </Suspense>
        </group>
    );
};

export default Player;