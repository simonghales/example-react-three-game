import React, {useEffect, useLayoutEffect, useRef} from "react";
import {useFrame, useResource, useThree} from "react-three-fiber";
import {gameRefs} from "../../../state/refs";
import {Vector3} from "three";
import {cameraPosition, playerPosition} from "../../../state/positions";
import {numLerp} from "../../../utils/numbers";
import {useProxy} from "valtio";
import {devState} from "../../../state/dev";

const cameraYOffset = 15

const data = {
    atRest: true,
    atRestTimestamp: 0,
    previousXDiff: 0,
    previousYDiff: 0,
}

const Camera: React.FC = () => {

    const lightRef: any = useResource()
    const ref = useRef<any>()
    const {setDefaultCamera} = useThree()
    const localDevState = useProxy(devState)
    const targetLocked = localDevState.targetLocked
    const inDanger = localDevState.inDanger

    useEffect(() => void setDefaultCamera(ref.current), [])

    useEffect(() => {
        ref.current.lookAt(0, 2, 0)
    }, [])

    useFrame(() => {
        if (!ref.current) return
        if (!lightRef.current) return
        const light = lightRef.current
        const camera = ref.current
        const {
            x,
            z: y,
        } = camera.position

        let newX = x
        let newY = y

        const isTargetLocked = targetLocked

        const playerXDiff = Math.round((playerPosition.x - playerPosition.previousX) * (isTargetLocked ? 2500 : 5000))
        const playerYDiff = Math.round((playerPosition.y - playerPosition.previousY) * (isTargetLocked ? 2500 : 5000))

        const moving = playerYDiff !== 0 || playerXDiff !== 0

        const cameraXDiff = x - playerPosition.x
        const cameraYDiff = (y - playerPosition.y) + cameraYOffset

        let movedSufficiently = inDanger || !data.atRest || (Math.abs(cameraXDiff) > 6 || Math.abs(cameraYDiff) > 3) || (Math.abs(playerXDiff) > 500 || Math.abs(playerYDiff) > 500)

        if (movedSufficiently) {

            const adjustedXDiff = numLerp(playerXDiff, data.previousXDiff, 0.9)
            const adjustedYDiff = numLerp(playerYDiff, data.previousYDiff, 0.9)

            if (adjustedXDiff === 0 && adjustedYDiff === 0) {
                // todo...
            }

            data.previousXDiff = adjustedXDiff
            data.previousYDiff = adjustedYDiff

            newX = playerPosition.x + (adjustedXDiff * 0.01)
            newY = playerPosition.y + (adjustedYDiff * 0.01) - cameraYOffset
        }

        if (isTargetLocked) {

            newX = numLerp(newX, playerPosition.targetX, 0.33)
            newY = numLerp(newY, playerPosition.targetY - cameraYOffset, 0.33)

        }

        let xDiff = Math.abs(x - newX)
        let yDiff = Math.abs(y - newY)

        if (x !== newX || y !== newY) {
            camera.position.x = numLerp(x, newX, 0.05)
            camera.position.z = numLerp(y, newY, 0.05)
            light.target.position.x = camera.position.x
            light.target.position.y = camera.position.y
            light.target.position.z = camera.position.z
            light.target.updateMatrixWorld()
            cameraPosition.previousX = x
            cameraPosition.previousY = y
        }

        // not at rest if camera moving, or camera was moving and player is still moving

        if ((xDiff > 0.05 || yDiff > 0.05) || (!data.atRest && moving) || isTargetLocked) {
            data.atRest = false
            data.atRestTimestamp = 0
        } else {
            if (!data.atRest) {
                if (!data.atRestTimestamp) {
                    data.atRestTimestamp = Date.now() + 250
                } else if (Date.now() > data.atRestTimestamp) {
                    data.atRest = true
                    console.log('at reset')
                }
            }
        }

    })

    return (
        <perspectiveCamera ref={ref} fov={35} position={[0, 15, -15]} near={5} far={100}>
            <directionalLight
                ref={lightRef}
                intensity={0.6}
                position={[20, 10, 30]}
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadowCameraLeft={-20}
                shadowCameraRight={20}
                shadowCameraTop={10}
                shadowCameraBottom={-20}
                shadowCameraNear={5}
                shadowCameraFar={300}
                castShadow
            />
            {/*{light.current && <directionalLightHelper args={[light.current, 5]}/>}*/}
        </perspectiveCamera>
    );
};

export default Camera;