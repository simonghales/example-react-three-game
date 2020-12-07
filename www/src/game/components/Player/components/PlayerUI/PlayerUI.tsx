import React from "react";
import {Html} from "@react-three/drei";
import styled, {css} from "styled-components";
import AttackUI, {AttackContainerSize} from "../../../Game/components/AttackUIContainer/components/AttackUI/AttackUI";
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
                <AttackUI size={enemiesInCloseRange ? AttackContainerSize.LARGE : enemiesInRange ? AttackContainerSize.MEDIUM : AttackContainerSize.SMALL}/>
            </Html>
        </group>
    );
};

export default PlayerUI;