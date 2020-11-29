import React, {useEffect} from "react";
import {boxSize} from "../Player/hooks/physics";
import {radians} from "../../../utils/angles";
import {Box} from "@react-three/drei";
import {useBody} from "../../../physics/components/Physics/hooks";
import {BodyShape, BodyType} from "../../../physics/bodies";
import {Vec2} from "planck-js";
import {COLLISION_FILTER_GROUPS} from "../../../physics/collisions/filters";

const TestBox: React.FC = () => {

    const [ref, api] = useBody(() => ({
        type: BodyType.dynamic,
        fixedRotation: false,
        position: Vec2(0, 0),
        fixtures: [
            {
                shape: BodyShape.box,
                hx: boxSize.width,
                hy: boxSize.length,
                center: [0, boxSize.offset],
                fixtureOptions: {
                    isSensor: true,
                    filterMaskBits: COLLISION_FILTER_GROUPS.player,
                },
            }
        ]
    }), {
        applyAngle: true,
        onCollideStart: () => console.log('collision start'),
        onCollideEnd: () => console.log('collision end'),
    })

    useEffect(() => {
        api.setAngle(radians(45))
    }, [])

    return (
        <Box args={[boxSize.width, 1, boxSize.length]} position={[0, 0.005, boxSize.offset]} ref={ref}>
            <meshBasicMaterial attach="material" color={"green"} transparent
                               opacity={0.25}/>
        </Box>
    );
};

export default TestBox;