import React, {useEffect, useRef} from "react";
import nipplejs, {JoystickManager} from 'nipplejs';
import styled from "styled-components";

const StyledContainer = styled.div`
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 50px;
`;

export let nippleManager: JoystickManager;

const Joystick: React.FC = () => {

    const ref = useRef<any>()

    useEffect(() => {

        nippleManager = nipplejs.create({
            zone: ref.current,
        });

    }, [])

    return (
        <StyledContainer ref={ref}></StyledContainer>
    );
};

export default Joystick;