import React, {useEffect, useRef} from "react";
import nipplejs, {JoystickManager} from 'nipplejs';
import styled from "styled-components";

const StyledContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    
    .nipple {
      pointer-events: none;
    }
    
`;

export let nippleManager: JoystickManager;

const Joystick: React.FC = ({children}) => {

    const ref = useRef<any>()

    useEffect(() => {

        nippleManager = nipplejs.create({
            zone: ref.current,
        });

    }, [])

    return (
        <StyledContainer ref={ref} onMouseDown={() => console.log('mouse down')}>
            {children}
        </StyledContainer>
    );
};

export default Joystick;