import React, {Suspense} from "react";
import Wall from "../../models/Wall/Wall";
import {Box} from "@react-three/drei";
import WallCorner from "../../models/WallCorner/WallCorner";
import {radians} from "../../../utils/angles";

const WallCornerMesh: React.FC<JSX.IntrinsicElements['group']> = ({rotation = [0, 0, 0], ...props}) => {
    return (
        <group {...props} rotation={rotation}>
            <Suspense fallback={null}>
                <WallCorner/>
            </Suspense>
            <Box args={[2.625, 8, 1]} position={[-0.7, 0, 0]} castShadow renderOrder={Infinity}>
                <meshBasicMaterial color="red" colorWrite={false} depthWrite={false} transparent/>
            </Box>
            <Box args={[2.625, 8, 1]} position={[0, 0, 0.7]} castShadow rotation={[0, radians(90), 0]} renderOrder={Infinity}>
                <meshBasicMaterial color="red" colorWrite={false} depthWrite={false} transparent/>
            </Box>
        </group>
    );
};

export default WallCornerMesh;