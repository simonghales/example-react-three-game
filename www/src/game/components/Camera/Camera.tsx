import React, {useEffect, useLayoutEffect, useRef} from "react";
import {useFrame, useResource, useThree} from "react-three-fiber";
import {gameRefs} from "../../../state/refs";
import {Vector3} from "three";

let vector = new Vector3()

const Camera: React.FC = () => {

    const lightRef: any = useResource()
    const ref = useRef<any>()
    const {setDefaultCamera} = useThree()
    // Make the camera known to the system

    useEffect(() => void setDefaultCamera(ref.current), [])

    useEffect(() => {
        ref.current.lookAt(0, 2, 0)
    }, [])

    useFrame(() => {
        if (!ref.current) return
        if (!gameRefs.player) return
        if (!lightRef.current) return
        const light = lightRef.current
        const camera = ref.current
        const player = gameRefs.player as unknown as any
        camera.position.x = player.position.x
        camera.position.z = player.position.z - 15
        //light.target.position.x = vector.x + 50
        //light.target.position.y = vector.y - 10
        //light.target.position.z = vector.z + 50
        light.target.position.x = camera.position.x
        light.target.position.y = camera.position.y
        light.target.position.z = camera.position.z
        light.target.updateMatrixWorld();
    })

    return (
        <perspectiveCamera ref={ref} fov={35} position={[0, 15, -15]} near={5} far={100}>
            <directionalLight
                ref={lightRef}
                intensity={0.6}
                position={[20, 10, 30]}
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadowCameraLeft={-100}
                shadowCameraRight={100}
                shadowCameraTop={10}
                shadowCameraBottom={-100}
                shadowCameraNear={5}
                shadowCameraFar={300}
                castShadow
            />
            {/*{light.current && <directionalLightHelper args={[light.current, 5]}/>}*/}
        </perspectiveCamera>
    );
};

export default Camera;