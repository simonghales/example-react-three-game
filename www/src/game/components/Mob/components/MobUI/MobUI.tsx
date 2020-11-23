import React from "react";
import {HTML} from "@react-three/drei";
import styled from "styled-components";
import {useProxy} from "valtio";
import {getMobHealthManager} from "../../../../../state/mobs";

const StyledContainer = styled.div`
    width: 100px;
    height: 20px;
    background-color: rgba(255,255,255,0.5);
    position: relative;
    overflow: hidden;
`;

const StyledAmount = styled.div<{
    amount: number,
}>`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: red;
    transition: all 200ms ease;
    transform: translateX(${props => (props.amount - 100)}%);
`;

const MobUI: React.FC<{
    id: number,
}> = ({id}) => {
    const managerProxy = useProxy(getMobHealthManager(id))
    return (
        <group position={[0, 3.5, 0]}>
            <HTML center>
                <StyledContainer>
                    <StyledAmount amount={managerProxy.health}/>
                </StyledContainer>
            </HTML>
        </group>
    );
};

export default MobUI;