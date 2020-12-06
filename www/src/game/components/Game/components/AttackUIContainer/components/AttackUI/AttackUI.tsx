import React, {useEffect, useRef} from "react";
import styled from "styled-components";
import nipplejs, {JoystickManager} from "nipplejs";
import {proxy} from "valtio";

const StyledContainer = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
`;

export const attackStateProxy = proxy({
    attackEngaged: false,
})

export const attackInputData = {
    xVel: 0,
    yVel: 0,
    lastReleased: 0,
}

export const attackBuffer: number[] = []

const AttackUI: React.FC = () => {

    const ref = useRef<any>()

    useEffect(() => {

        const manager = nipplejs.create({
            zone: ref.current,
            dataOnly: true,
            mode: 'static',
            position: {
                top: '50%',
                left: '50%',
            }
        });

        manager.on("start", () => {
            console.log('attack nipple start')
            attackStateProxy.attackEngaged = true
        })

        manager.on("end", () => {
            console.log('attack nipple end')
            attackBuffer.push(Date.now())
            attackInputData.lastReleased = Date.now()
            attackStateProxy.attackEngaged = false
        })

        manager.on("move", (_, data) => {

            const {x, y} = data.vector

            if (Math.abs(x) < 0.1 && Math.abs(y) < 0.1) {
                // attackInputData.xVel = 0
                // attackInputData.yVel = 0
                return
            }

            attackInputData.xVel = x * -1
            attackInputData.yVel = y

        })

    }, [])

    return (
        <StyledContainer ref={ref}/>
    );
};

export default AttackUI;