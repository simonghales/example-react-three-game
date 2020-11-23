import React from "react";
import styled from "styled-components";
import {GiPunch} from "react-icons/all";
import {InputKeys, inputsState, RAW_INPUTS} from "../../../../../state/inputs";

const StyledContainer = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
`;

const StyledAttackButton = styled.div`
    position: absolute;
    bottom: 50px;
    right: 50px;
    width: 100px;
    height: 100px;
    border: 2px solid white;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    cursor: pointer;
`;

const GameUI: React.FC = () => {

    const onPunchMouseDown = () => {
        inputsState[InputKeys.PUNCH].raw = true
    }

    const onPunchMouseUp = () => {
        inputsState[InputKeys.PUNCH].raw = false
    }

    return (
        <StyledContainer>
            <StyledAttackButton onMouseDown={onPunchMouseDown} onMouseUp={onPunchMouseUp} onTouchStart={onPunchMouseDown} onTouchEnd={onPunchMouseUp}>
                <GiPunch size={60}/>
            </StyledAttackButton>
        </StyledContainer>
    );
};

export default GameUI;