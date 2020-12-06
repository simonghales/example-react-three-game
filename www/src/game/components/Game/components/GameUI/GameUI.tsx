import React, {useCallback} from "react";
import styled, {css} from "styled-components";
import {GiPrayer, GiPunch, GiRun} from "react-icons/all";
import {InputKeys, inputsState, RAW_INPUTS} from "../../../../../state/inputs";
import StatsUI from "./components/StatsUI/StatsUI";
import {usePlayerCanRecharge} from "../../../../../state/player";

const StyledWrapper = styled.div`
    user-select: none;
`;

const StyledContainer = styled.div`
    position: absolute;
    bottom: 10px;
    right: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
`;

const cssDisabled = css`
  opacity: 0.25;
`

const StyledAttackButton = styled.div<{
    disabled?: boolean,
}>`
    width: 100px;
    height: 100px;
    border: 2px solid white;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    cursor: pointer;
    
    &:not(:first-child) {
      margin-left: 10px;
    }
    
    ${props => props.disabled ? cssDisabled : ''};
    
`;

const StyledButtons = styled.div`
    margin-top: 10px;
    display: flex;
`;

const GameUI: React.FC = () => {

    const canRecharge = usePlayerCanRecharge()

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

    const onRechargeMouseDown = useCallback(() => {
        inputsState[InputKeys.RECHARGE].raw = true
    }, [])

    const onRechargeMouseUp = useCallback(() => {
        inputsState[InputKeys.RECHARGE].raw = false
    }, [])

    return (
        <StyledWrapper>
            <StatsUI/>
            <StyledContainer>
                {/*<StyledAttackButton onMouseDown={onPunchMouseDown} onMouseUp={onPunchMouseUp}*/}
                {/*                    onTouchStart={onPunchMouseDown} onTouchEnd={onPunchMouseUp}>*/}
                {/*    <GiPunch size={60}/>*/}
                {/*</StyledAttackButton>*/}
                <StyledButtons>
                    <StyledAttackButton onMouseDown={onRechargeMouseDown} onMouseUp={onRechargeMouseUp}
                                        onTouchStart={onRechargeMouseDown} onTouchEnd={onRechargeMouseUp} disabled={!canRecharge}>
                        <GiPrayer size={60}/>
                    </StyledAttackButton>
                    {/*<StyledAttackButton onMouseDown={onRunMouseDown} onMouseUp={onRunMouseUp}*/}
                    {/*                    onTouchStart={onRunMouseDown} onTouchEnd={onRunMouseUp}>*/}
                    {/*    <GiRun size={60}/>*/}
                    {/*</StyledAttackButton>*/}
                </StyledButtons>
            </StyledContainer>
        </StyledWrapper>
    );
};

export default GameUI;