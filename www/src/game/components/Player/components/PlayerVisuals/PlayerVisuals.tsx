import React, {Suspense, useEffect, useState} from "react";
import Knight from "../../../../../3d/models/Knight/Knight";
import {proxy, useProxy} from "valtio";
import {attackState} from "../../hooks/attack";
import {playerHealth} from "../../../../../state/player";

export const playerState = proxy({
    rollCooldown: false,
    rolling: false,
    moving: false,
    running: false,
})

const PlayerVisuals: React.FC = () => {

    const localPlayerState = useProxy(playerState)
    const {lastAttack} = useProxy(attackState)
    const {lastDamaged} = useProxy(playerHealth)

    return (
        <Suspense fallback={null}>
            <Knight lastDamaged={lastDamaged} lastAttack={lastAttack} moving={localPlayerState.moving} running={localPlayerState.running} position={[0, localPlayerState.rolling ? -1.5 : 0, 0]}/>
        </Suspense>
    );
};

export default PlayerVisuals;