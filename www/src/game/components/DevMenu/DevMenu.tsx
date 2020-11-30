import React from "react";
import styled from "styled-components";
import {useProxy} from "valtio";
import {devState} from "../../../state/dev";

const StyledContainer = styled.div`
    position: absolute;
    bottom: 10px;
    left: 10px;
`;

const StyledFullscreen = styled.button`
`;

const DevMenu: React.FC<{
    onFullscreen: () => void,
}> = ({onFullscreen}) => {

    const localDevState = useProxy(devState)

    return (
        <StyledContainer>
            <div>
                <StyledFullscreen onClick={onFullscreen}>
                    FULLSCREEN
                </StyledFullscreen>
            </div>
        </StyledContainer>
    );
};

export default DevMenu;