import { Box } from "@react-three/drei";
import React, {Suspense} from "react";
import Wall from "../../models/Wall/Wall";

const WallMesh: React.FC<JSX.IntrinsicElements['group']> = (props) => {
    return (
        <group {...props}>
            <Suspense fallback={null}>
                <Wall/>
            </Suspense>
            <Box args={[4, 8, 1]} castShadow>
                <meshBasicMaterial color="red" colorWrite={false} />
            </Box>
        </group>
    );
};

export default WallMesh;