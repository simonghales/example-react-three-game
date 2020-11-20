import React from "react";
import {Box} from "@react-three/drei";
import {useBody} from "../../../physics/components/Physics/hooks";
import {BodyShape, BodyType} from "../../../physics/bodies";
import {Vec2} from "planck-js";

const color = "red"

const Mob: React.FC = () => {

    const x = 0
    const y = 0
    const size = 5

    const [ref, api] = useBody(() => ({
        type: BodyType.static,
        shape: BodyShape.box,
        hx: size,
        hy: size,
        position: Vec2(x, y),
        fixtureOptions: {
            isSensor: false,
        }
    }))

    return (
        <Box ref={ref} args={[size, 2, size]} position={[x, 1, y]} castShadow receiveShadow onPointerDown={() => console.log('hello')}>
            <meshToonMaterial attach="material" color={color}/>
        </Box>
    );
};

export default Mob;