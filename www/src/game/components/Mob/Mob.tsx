import React from "react";
import {Box} from "@react-three/drei";

const color = "red"

const Mob: React.FC = () => {
    return (
        <Box args={[1, 2, 1]} position={[0, 1, 0]} castShadow receiveShadow>
            <meshToonMaterial attach="material" color={color}/>
        </Box>
    );
};

export default Mob;