import React, {useEffect, useRef} from "react";
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


export const STATS_CSS_CLASS = 'stats'

const StyledContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
`;

const Game: React.FC = () => {

    const ref = useRef()

    const handle = useFullScreenHandle()
    const {active, enter} = handle

    // useEffect(() => {
    //
    //     nippleManager = nipplejs.create({
    //         zone: ref.current,
    //     });
    //
    // }, [])

    return (
        <FullScreen handle={handle}>
            <StyledContainer>
                <Joystick>
                    <Canvas onPointerMissed={() => console.log('missed?')} concurrent shadowMap>
                        <Physics>
                            <Camera/>
                            <Lights/>
                            <Floor/>
                            <Player/>
                            {/*<OldMob/>*/}
                            <Mob id={0} x={5} y={5}/>
                            <Mob id={1} x={10} y={5}/>
                            <Mob id={2} x={0} y={5}/>
                            <Mob id={3} x={5} y={10}/>
                            <Mob id={4} x={0} y={10}/>
                            <Mob id={5} x={10} y={10}/>
                            <AttackColliders/>
                            <Stats className={STATS_CSS_CLASS}/>
                            <PhysWall/>
                            {/*<TestBox/>*/}
                        </Physics>
                    </Canvas>
                </Joystick>
                <GameUI/>
                <DevMenu onFullscreen={enter}/>
            </StyledContainer>
        </FullScreen>
    );
};

export default Game;