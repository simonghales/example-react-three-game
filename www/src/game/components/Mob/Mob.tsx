import React, {useEffect, useRef, useState} from "react";
import MobPhysics from "./components/MobPhysics/MobPhysics";
import MobVisuals from "./components/MobVisuals/MobVisuals";
import {Object3D} from "three";
import MobTargetTracking from "./components/MobTargetTracking/MobTargetTracking";
import {useProxy} from "valtio";
import {usePlayerTarget} from "../../../state/player";
import {deleteMobHealthManager, getMobHealthManager, initMobHealthManager} from "../../../state/mobs";

const useIsTargeted = (id: number): boolean => {
    const targetID = usePlayerTarget()
    return targetID === id
}

const useIsDead = (id: number): boolean => {

    const managerProxy = useProxy(getMobHealthManager(id))
    return managerProxy.health <= 0

}

const MobInner: React.FC<{
    id: number,
    x: number,
    y: number,
}> = ({id, x, y}) => {

    const localRef = useRef<Object3D>(new Object3D())
    const isTargeted = useIsTargeted(id)
    const isDead = useIsDead(id)
    const managerProxy = useProxy(getMobHealthManager(id))

    return (
        <>
            {
                !isDead && (
                    <MobPhysics x={x} y={y} id={id} localRef={localRef}/>
                )
            }
            <MobVisuals lastHit={managerProxy.lastHit} x={x} y={y} isDead={isDead} localRef={localRef} id={id} targeted={isTargeted}/>
            {
                isTargeted && (
                    <MobTargetTracking localRef={localRef}/>
                )
            }
        </>
    );
};

const Mob: React.FC<{
    id: number,
    x: number,
    y: number,
}> = ({id, x, y}) => {

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        initMobHealthManager(id)
        setMounted(true)

        return () => {
            deleteMobHealthManager(id)
        }
    }, [])

    if (!mounted) return null

    return <MobInner id={id} x={x} y={y}/>
}

export default Mob;