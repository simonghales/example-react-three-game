import React, {useLayoutEffect, useRef} from "react";
import {Canvas} from "react-three-fiber";
import {gameRefs} from "../../../state/refs";

const Lights: React.FC = () => {
    return (
        <>
            <ambientLight intensity={0.95}/>
        </>
    );
};

export default Lights;