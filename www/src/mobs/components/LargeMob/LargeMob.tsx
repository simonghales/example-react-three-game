import React from "react";
import Mob from "../../../game/components/Mob/Mob";
import {MOB_VARIANT} from "../../../game/components/Mob/data";

const LargeMob: React.FC = () => {
    return (
        <Mob id={6} x={20} y={22} variant={MOB_VARIANT.large}/>
    );
};

export default LargeMob;