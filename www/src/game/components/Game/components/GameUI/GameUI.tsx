import React, {useCallback} from "react";
import styled from "styled-components";
import {GiPunch, GiRun} from "react-icons/all";
import {InputKeys, inputsState, RAW_INPUTS} from "../../../../../state/inputs";
import StatsUI from "./components/StatsUI/StatsUI";

const StyledWrapper = styled.div`
    user-select: none;
`;

const StyledContainer = styled.div`
    position: absolute;
    bottom: 10px;
    right: 10px;
`;

const StyledAttackButton = styled.div`
    width: 100px;
    height: 100px;
    border: 2px solid white;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    cursor: pointer;
    
    &:not(:first-child) {
      margin-top: 10px;
    }
    
`;

const GameUI: React.FC = () => {

    const onPunchMouseDown = useCallback(() => {
        inputsState[InputKeys.PUNCH].raw = true
    }, [])

    const onPunchMouseUp = useCallback(() => {
        inputsState[InputKeys.PUNCH].raw = false
    }, [])

    const onRunMouseDown = useCallback(() => {
        inputsState[InputKeys.SHIFT].raw = true
    }, [])

    const onRunMouseUp = useCallback(() => {
        inputsState[InputKeys.SHIFT].raw = false
    }, [])

    return (
        <StyledWrapper>
            <StatsUI/>
            <StyledContainer>
                <StyledAttackButton onMouseDown={onRunMouseDown} onMouseUp={onRunMouseUp}
                                    onTouchStart={onRunMouseDown} onTouchEnd={onRunMouseUp}>
                    <GiRun size={60}/>
                </StyledAttackButton>
                <StyledAttackButton onMouseDown={onPunchMouseDown} onMouseUp={onPunchMouseUp}
                                    onTouchStart={onPunchMouseDown} onTouchEnd={onPunchMouseUp}>
                    <GiPunch size={60}/>
                </StyledAttackButton>
            </StyledContainer>
        </StyledWrapper>
    );
};

export default GameUI;