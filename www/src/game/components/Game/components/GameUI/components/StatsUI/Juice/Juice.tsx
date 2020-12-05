import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {subscribe} from "valtio";
import {JUICE_RECHARGE_COST, playerCanRecharge, playerEnergy, playerJuice} from "../../../../../../../../state/player";

const StyledContainer = styled.div``;

const StyledBar = styled.div<{
    full: boolean,
}>`
    width: 100%;
    max-width: 200px;
    height: 14px;
    border: 2px solid white;
    overflow: hidden;
    position: relative;
    opacity: ${props => props.full ? '1' : '0.5'};
    transition: opacity 250ms ease;
`;

const StyledBarInner = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: white;
    transform: translate(-100%, 0);
    transition: transform ease 200ms;
`;

const Juice: React.FC = () => {
    const barRef = useRef<any>()
    const [full, setFull] = useState(() => playerCanRecharge(false))

    useEffect(() => {

        const calcJuice = () => {
            if (barRef.current) {
                const juice = playerJuice.juice
                const juicePercent = 100 - juice
                barRef.current.style.transform = `translate(-${juicePercent}%, 0)`
                setFull(playerCanRecharge(false))
            }
        }

        calcJuice()

        const unsubscribe = subscribe(playerJuice, () => {
            calcJuice()
        })
        return () => {
            unsubscribe()
        }
    }, [])

    return (
        <StyledContainer>
            <StyledBar full={full}>
                <StyledBarInner ref={barRef}/>
            </StyledBar>
        </StyledContainer>
    );
};

export default Juice;