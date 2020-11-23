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
import DevMenu from "../DevMenu/DevMenu";
import Physics from "../../../physics/components/Physics/Physics";
import Mob from "../Mob/Mob";
import GameUI from "./components/GameUI/GameUI";
import AttackColliders from "./components/AttackColliders/AttackColliders";

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
                    <Physics>
                        <Camera/>
                        <Lights/>
                        <Floor/>
                        <Player/>
                        {/*<OldMob/>*/}
                        <Mob/>
                        <AttackColliders/>
                        <Stats/>
                    </Physics>
                </Canvas>
                <Joystick/>
                <GameUI/>
                <DevMenu onFullscreen={enter}/>
            </StyledContainer>
        </FullScreen>
    );
};

export default Game;