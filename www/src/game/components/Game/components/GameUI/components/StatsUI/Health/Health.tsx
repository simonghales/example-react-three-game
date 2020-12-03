import React from "react"
import styled from "styled-components";
import {useProxy} from "valtio";
import {playerHealth} from "../../../../../../../../state/player";

const StyledContainer = styled.div`
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 9999999;
`

const Health: React.FC = () => {
    const healthProxy = useProxy(playerHealth)
    return (
        <StyledContainer>
            <div>
                Health: {healthProxy.health}
            </div>
        </StyledContainer>
    )
}

export default Health