import React from "react"
import styled, {css} from "styled-components";
import {useProxy} from "valtio";
import {playerHealth} from "../../../../../../../../state/player";
import {GiHearts} from "react-icons/all";
import {COLORS} from "../../../../../../../../ui/colors";

const StyledContainer = styled.div`
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 9999999;
`

const StyledHeartsContainer = styled.div`
  display: flex;
`

const StyledHeart = styled.div`
  position: relative;
`

const StyledHeartBg = styled.div<{
    full: boolean,
}>`
  color: rgba(0,0,0,0.5);
`

const cssHalf = css`
  clip-path: inset(0 50% 0 0);
`

const cssFull = css`
  clip-path: inset(0 0 0 0);
`

const StyledHeartFg = styled.div<{
    full: boolean,
    half: boolean,
}>`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  color: ${COLORS.health};
  clip-path: inset(0 100% 0 0);
  ${props => props.full ? cssFull : ''};
  ${props => props.half ? cssHalf : ''};
  transition: all 200ms ease;
`

const Health: React.FC = () => {
    const healthProxy = useProxy(playerHealth)
    return (
        <StyledContainer>
            <StyledHeartsContainer>
                {
                    Array.from({length: healthProxy.maxHealth}).map((_, index) => {
                        const full = healthProxy.health >= index + 1
                        const half = healthProxy.health === index + 0.5
                        return (
                            <StyledHeart key={index}>
                                <StyledHeartBg full={full}>
                                    <GiHearts size={18}/>
                                </StyledHeartBg>
                                <StyledHeartFg full={full} half={half}>
                                    <GiHearts size={18}/>
                                </StyledHeartFg>
                            </StyledHeart>
                        )
                    })
                }
            </StyledHeartsContainer>
        </StyledContainer>
    )
}

export default Health