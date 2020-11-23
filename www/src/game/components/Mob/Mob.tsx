import React, {useEffect, useRef, useState} from "react";
import MobPhysics from "./components/MobPhysics/MobPhysics";
import MobVisuals from "./components/MobVisuals/MobVisuals";
import {Object3D} from "three";
import MobTargetTracking from "./components/MobTargetTracking/MobTargetTracking";
import {useProxy} from "valtio";
import {playerTargets} from "../../../state/player";
import {deleteMobHealthManager, getMobHealthManager, initMobHealthManager} from "../../../state/mobs";
import MobUI from "./components/MobUI/MobUI";

const useIsTargetted = (id: number): boolean => {
    const targetID = useProxy(playerTargets).targetID
    return targetID === id
}

const useIsDead = (id: number): boolean => {

    const managerProxy = useProxy(getMobHealthManager(id))

    return managerProxy.health <= 0

}

const mobID = 0 // todo - dynamic

const MobInner: React.FC<{
    id: number,
}> = ({id}) => {

    const localRef = useRef<Object3D>(new Object3D())
    const isTargetted = useIsTargetted(id)
    const isDead = useIsDead(id)

    return (
        <>
            {
                !isDead && (
                    <MobPhysics id={mobID} localRef={localRef}/>
                )
            }
            <MobVisuals isDead={isDead} localRef={localRef} id={id}/>
            {
                isTargetted && (
                    <MobTargetTracking localRef={localRef}/>
                )
            }
        </>
    );
};

const Mob: React.FC = () => {

    const id = mobID

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        initMobHealthManager(id)
        setMounted(true)

        return () => {
            deleteMobHealthManager(id)
        }
    })

    if (!mounted) return null

    return <MobInner id={id}/>
}

export default Mob;