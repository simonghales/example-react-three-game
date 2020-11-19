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
import Mob from "../Mob/Mob";
import DevMenu from "../DevMenu/DevMenu";

const StyledContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
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
                    <Player/>
                    <Mob/>
                    <Stats/>
                </Canvas>
                <Joystick/>
                <DevMenu onFullscreen={enter}/>
            </StyledContainer>
        </FullScreen>
    );
};

export default Game;