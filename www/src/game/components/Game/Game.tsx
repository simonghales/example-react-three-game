import React, {useEffect, useRef, useState} from "react";
import {Canvas} from "react-three-fiber";
import {Box, Stats} from "@react-three/drei";
import Floor from "../../../3d/components/Floor/Floor";
import styled from "styled-components";
import Player from "../Player/Player";
import Joystick, {nippleManager} from "../Joystick/Joystick";
import {FullScreen, useFullScreenHandle} from "react-full-screen";
import Lights from "../Lights/Lights";
import Camera from "../Camera/Camera";
import DevMenu from "../DevMenu/DevMenu";
import Physics from "../../../physics/components/Physics/Physics";
import Mob from "../Mob/Mob";
import GameUI from "./components/GameUI/GameUI";
import AttackColliders from "./components/AttackColliders/AttackColliders";
import nipplejs from "nipplejs";
import TestBox from "../TestBox/TestBox";
import Wall from "../../../3d/models/Wall/Wall";
import WallCorner from "../../../3d/models/WallCorner/WallCorner";
import PhysWall from "../PhysWall/PhysWall";
import Room from "../Room/Room";
import GameAI from "./components/GameAI/GameAI";
import MobsManager from "../MobsManager/MobsManager";
import AttackUIContainer from "./components/AttackUIContainer/AttackUIContainer";


export const STATS_CSS_CLASS = 'stats'

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
                <Joystick>
                    <Canvas concurrent shadowMap>
                        <GameAI/>
                        <Physics>
                            <Camera/>
                            <Lights/>
                            <Floor/>
                            <Player/>
                            {/*<OldMob/>*/}
                            <MobsManager/>
                            <AttackColliders/>
                            <Stats className={STATS_CSS_CLASS}/>
                            <Room/>
                            {/*<PhysWall/>*/}
                            {/*<TestBox/>*/}
                        </Physics>
                    </Canvas>
                </Joystick>
                <GameUI/>
                <AttackUIContainer/>
                <DevMenu onFullscreen={enter}/>
            </StyledContainer>
        </FullScreen>
    );
};

export default Game;