import React, {TouchEventHandler, useCallback, useEffect, useRef} from "react";
import styled, {css} from "styled-components";
import nipplejs, {JoystickManager} from "nipplejs";
import {proxy, useProxy} from "valtio";
import {useWindowSize} from "@react-hook/window-size";

export enum AttackContainerSize {
    LARGE = 'LARGE',
    MEDIUM = 'MEDIUM',
    SMALL = 'SMALL'
}

const getAttackContainerSize = (size: AttackContainerSize): number => {
    switch (size) {
        case AttackContainerSize.LARGE:
            return 200
        case AttackContainerSize.MEDIUM:
            return 150
        default:
            return 100
    }
}

const StyledContainer = styled.div<{
    containerSize: number
}>`
    position: relative;
    padding:2px;
    width: ${props => props.containerSize}px;
    height: ${props => props.containerSize}px;
`;

const StyledInner = styled.div`
    width: 100%;
    height: 100%;
    border: 3px solid rgba(255,0,0,0.5);
    pointer-events: none;
`;

export const attackStateProxy = proxy({
    attackEngaged: false,
})

export const attackInputData = {
    xVel: 0,
    yVel: 0,
    lastReleased: 0,
    nextAvailable: 0,
}

export const attackBuffer: number[] = []

const getParentXY = (event: any): [number, number] => {
    const parentTransform = event.target.parentElement.parentElement.style.transform
    const transformSplit = parentTransform.split("(")[1].split(",")
    const parentX = Number(transformSplit[0].trim().replace('px', ''))
    const parentY = Number(transformSplit[1].trim().replace('px', ''))
    return [parentX, parentY]
}

const AttackUI: React.FC<{
    size: AttackContainerSize,
}> = ({size}) => {
    const ref = useRef<any>()
    const containerSize = getAttackContainerSize(size)

    const calcOffset = useCallback((x: number, y: number, parentX: number, parentY: number) => {

        const containerCenterX = parentX
        const containerCenterY = parentY

        // get angle

        const angle = Math.atan2((x - containerCenterX), (y - containerCenterY))

        const xVector = Math.cos(angle)
        const yVector = Math.sin(angle)

        const xDistance = Math.abs(x - containerCenterX)
        const yDistance = Math.abs(y - containerCenterY)

        if (xDistance < 10 && yDistance < 10) {
            // attackInputData.xVel = 0
            // attackInputData.yVel = 0
            return
        }

        attackInputData.xVel = xVector * -1
        attackInputData.yVel = yVector

    }, [])

    const onStart = useCallback((event: any) => {

        attackStateProxy.attackEngaged = true

        let x = 0
        let y = 0

        if (event.type === "mousedown") {

            x = event.clientX
            y = event.clientY

        } else {
            x = event.changedTouches[0].clientX
            y = event.changedTouches[0].clientY
        }

        const [parentX, parentY] = getParentXY(event)

        calcOffset(x, y, parentX, parentY)

    }, [])

    const onEnd = useCallback((event: any) => {

        let x = 0
        let y = 0

        if (event.type === "mouseup") {

            x = event.clientX
            y = event.clientY

        } else {
            x = event.changedTouches[0].clientX
            y = event.changedTouches[0].clientY
        }

        const [parentX, parentY] = getParentXY(event)

        calcOffset(x, y, parentX, parentY)

        const now = Date.now()

        if (!attackInputData.nextAvailable || now >= attackInputData.nextAvailable) {
            attackBuffer.push(now)
            attackInputData.nextAvailable = now + 350
        }

        attackInputData.lastReleased = now
        attackStateProxy.attackEngaged = false

    }, [])

    const onMove = useCallback((event: any) => {

        let x = 0
        let y = 0

        if (event.type === "mousemove") {

            if (!attackStateProxy.attackEngaged) return

            x = event.clientX
            y = event.clientY

        } else {
            x = event.targetTouches[0].clientX
            y = event.targetTouches[0].clientY
        }

        const [parentX, parentY] = getParentXY(event)

        calcOffset(x, y, parentX, parentY)

    }, [size])

    return (
        <StyledContainer containerSize={containerSize} ref={ref} onTouchStartCapture={onStart} onTouchEndCapture={onEnd} onTouchMoveCapture={onMove} onMouseDownCapture={onStart} onMouseMoveCapture={onMove} onMouseUpCapture={onEnd}>
            <StyledInner/>
        </StyledContainer>
    );
};

export default AttackUI;