import React from "react";
import Mob from "../Mob/Mob";
import Physics from "../../../physics/components/Physics/Physics";
import LargeMob from "../../../mobs/components/LargeMob/LargeMob";

const MobsManager: React.FC = () => {
    return (
        <>
            <Mob id={0} x={26} y={14}/>
            <Mob id={1} x={14} y={14}/>
            <Mob id={2} x={20} y={14}/>
            <Mob id={3} x={26} y={17}/>
            <Mob id={4} x={14} y={17}/>
            <Mob id={5} x={20} y={17}/>
            <LargeMob/>
        </>
    );
};

export default MobsManager;