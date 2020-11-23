import React, {Suspense, useEffect, useState} from "react";
import Knight from "../../../../../3d/models/Knight/Knight";
import {proxy, useProxy} from "valtio";
import {attackState} from "../../hooks/attack";

export const playerState = proxy({
    moving: false,
    running: false,
})

const PlayerVisuals: React.FC = () => {

    const localPlayerState = useProxy(playerState)
    const {lastAttack} = useProxy(attackState)

    return (
        <Suspense fallback={null}>
            <Knight lastAttack={lastAttack} moving={localPlayerState.moving} running={localPlayerState.running}/>
        </Suspense>
    );
};

export default PlayerVisuals;