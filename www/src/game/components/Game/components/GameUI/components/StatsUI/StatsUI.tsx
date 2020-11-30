import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {subscribe, useProxy} from "valtio";
import {playerEnergy} from "../../../../../../../state/player";

const StyledContainer = styled.div`
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    display: flex;
    justify-content: center;
    z-index: 9999999;
`;

const StyledBar = styled.div`
    width: 100%;
    max-width: 200px;
    height: 14px;
    border: 2px solid white;
    opacity: 0.5;
    overflow: hidden;
    position: relative;
`;

const StyledBarInner = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: white;
    transform: translate(0%, 0);
    transition: transform linear 110ms;
`;

const StatsUI: React.FC = () => {
    const barRef = useRef<any>()
    const [full, setFull] = useState(playerEnergy.energy === 100)

    useEffect(() => {
        const unsubscribe = subscribe(playerEnergy, () => {
            if (barRef.current) {
                const energy = playerEnergy.energy
                const energyPercent = 100 - energy
                barRef.current.style.transform = `translate(-${energyPercent}%, 0)`
                setFull(energy >= 100)
            }
        })
        return () => {
            unsubscribe()
        }
    }, [])

    return (
        <StyledContainer>
            <StyledBar>
                <StyledBarInner ref={barRef}/>
            </StyledBar>
        </StyledContainer>
    );
};

export default StatsUI;