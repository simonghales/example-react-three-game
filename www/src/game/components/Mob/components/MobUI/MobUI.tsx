import React from "react";
import {Html} from "@react-three/drei";
import styled, {css} from "styled-components";
import {useProxy} from "valtio";
import {getMobHealthManager} from "../../../../../state/mobs";

const cssHide = css`
  opacity: 0;
`

const StyledContainer = styled.div<{
    hide: boolean,
}>`
    pointer-events: none;
    width: 50px;
    height: 10px;
    background-color: rgba(0,0,0,0.25);
    position: relative;
    overflow: hidden;
    transition: opacity 500ms 250ms ease;
    opacity: 0.75;
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
    background-color: #980623;
    transition: all 200ms ease;
    transform: translateX(${props => (props.amount - 100)}%);
`;

const MobUI: React.FC<{
    id: number,
}> = ({id}) => {
    const managerProxy = useProxy(getMobHealthManager(id))
    return (
        <group position={[0, 3.5, 0]}>
            <Html center>
                <StyledContainer hide={managerProxy.health <= 0}>
                    <StyledAmount amount={managerProxy.health}/>
                </StyledContainer>
            </Html>
        </group>
    );
};

export default MobUI;