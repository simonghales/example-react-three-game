import React from "react";
import {Html} from "@react-three/drei";
import styled, {css} from "styled-components";
import AttackUI from "../../../Game/components/AttackUIContainer/components/AttackUI/AttackUI";
import {useEnemiesInCloseRange, useEnemiesInRange} from "../../../../../state/player";

const cssSmaller = css`
    width: 100px;
    height: 100px;
`

const cssMedium = css`
    width: 150px;
    height: 150px;
`

const StyledRegion = styled.div<{
    smaller: boolean,
    large: boolean,
}>`
    border: 3px solid rgba(255,0,0,0.5);
    width: 200px;
    height: 200px;
    ${props => props.smaller ? cssSmaller : !props.large ? cssMedium : ''};
`;

// todo - change region size depending upon whether enemies are nearby or not

export const containerPortal: {
    ref: any,
} = {
    ref: null,
}

const PlayerUI: React.FC = () => {

    const enemiesInRange = useEnemiesInRange()
    const enemiesInCloseRange = useEnemiesInCloseRange()

    return (
        <group position={[0, 1.75, 0]}>
            <Html center portal={containerPortal.ref}>
                <StyledRegion smaller={!enemiesInRange && !enemiesInCloseRange} large={enemiesInCloseRange}>
                    <AttackUI/>
                </StyledRegion>
            </Html>
        </group>
    );
};

export default PlayerUI;