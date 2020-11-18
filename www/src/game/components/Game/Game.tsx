import React from "react";
import {Canvas} from "react-three-fiber";
import {Box, Stats} from "@react-three/drei";
import Floor from "../../../3d/components/Floor/Floor";
import styled from "styled-components";
import Player from "../Player/Player";
import Joystick from "../Joystick/Joystick";
import {FullScreen, useFullScreenHandle} from "react-full-screen";
import Lights from "../Lights/Lights";
import Camera from "../Camera/Camera";

const StyledContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
`;

const StyledFullscreen = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
`;

const Game: React.FC = () => {
    const handle = useFullScreenHandle()
    const {active, enter} = handle
    return (
        <FullScreen handle={handle}>
            <StyledContainer>
                <Canvas concurrent shadowMap>
                    <Camera/>
                    <Lights/>
                    <Floor/>
                    <Box/>
                    <Player/>
                    <Stats/>
                </Canvas>
                <Joystick/>
                {
                    !active && (
                        <StyledFullscreen onClick={enter}>
                            FULLSCREEN
                        </StyledFullscreen>
                    )
                }
            </StyledContainer>
        </FullScreen>
    );
};

export default Game;