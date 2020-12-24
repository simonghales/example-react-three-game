import reset from "styled-reset";
import {createGlobalStyle} from "styled-components";
import {STATS_CSS_CLASS} from "../game/components/Game/Game";

export const GlobalStyle = createGlobalStyle`
  ${reset};
  
  body {
    background-color: #040608;
    color: #FFFFFF;
    font-family: 'Open Sans', sans-serif;
    font-size: 15px;
    line-height: 1.2;
  }
  
  canvas {
    -webkit-touch-callout:none;
    -webkit-user-select:none;
    -khtml-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    outline:0;
    -webkit-tap-highlight-color:rgba(255,255,255,0);
  }
  
  body {
    -webkit-touch-callout:none;
    -webkit-user-select:none;
    -khtml-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    outline:0;
    -webkit-tap-highlight-color:rgba(255,255,255,0);
  }
  
  * {
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  a {
    text-decoration: none;
  }
  
  strong {
    font-weight: bold;
  }
  
  .${STATS_CSS_CLASS} {
    top: unset !important;
    left: 0px !important;
    bottom: 0px !important;
  }
  
`;
