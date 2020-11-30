import React from "react";
import {HTML} from "@react-three/drei";
import styled, {css} from "styled-components";
import {useProxy} from "valtio";
import {getMobHealthManager} from "../../../../../state/mobs";

const cssHide = css`
  opacity: 0;
`

const StyledContainer = styled.div<{
    hide: boolean,
}>`
    width: 50px;
    height: 10px;
    background-color: rgba(255,255,255,0.5);
    position: relative;
    overflow: hidden;
    transition: opacity 500ms 250ms ease;
    ${props => props.hide ? cssHide : ''};
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
                <StyledContainer hide={managerProxy.health === 0}>
                    <StyledAmount amount={managerProxy.health}/>
                </StyledContainer>
            </HTML>
        </group>
    );
};

export default MobUI;