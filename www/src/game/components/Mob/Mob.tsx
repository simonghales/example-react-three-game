import React, {useEffect, useRef, useState} from "react";
import MobPhysics from "./components/MobPhysics/MobPhysics";
import MobVisuals from "./components/MobVisuals/MobVisuals";
import {Object3D} from "three";
import MobTargetTracking from "./components/MobTargetTracking/MobTargetTracking";
import {useProxy} from "valtio";
import {playerTargets, usePlayerTarget} from "../../../state/player";
import {deleteMobHealthManager, getMobHealthManager, initMobHealthManager} from "../../../state/mobs";
import {addMob, removeMob, updateMob} from "../../../temp/ai";
import {useMobBrain} from "./hooks/brain";
import {MOB_VARIANT} from "./data";

const useIsTargeted = (id: number): boolean => {
    const targetID = usePlayerTarget()
    return targetID === id
}

const useIsInAttackRange = (id: number): boolean => {
    const {attackRange} = useProxy(playerTargets)
    return attackRange.includes(id)
}

const useIsDead = (id: number): boolean => {

    const managerProxy = useProxy(getMobHealthManager(id))
    return managerProxy.health <= 0

}

const MobInner: React.FC<{
    id: number,
    x: number,
    y: number,
    variant: MOB_VARIANT,
}> = ({id, x, y, variant}) => {

    const localRef = useRef<Object3D>(new Object3D())
    const isTargeted = useIsTargeted(id)
    const inAttackRange = useIsInAttackRange(id)
    const isDead = useIsDead(id)
    const managerProxy = useProxy(getMobHealthManager(id))

    useEffect(() => {

        updateMob(id, {
            alive: !isDead,
        })

    }, [id, isDead])

    return (
        <>
            {
                !isDead && (
                    <MobPhysics variant={variant} x={x} y={y} id={id} localRef={localRef}/>
                )
            }
            <MobVisuals variant={variant} lastHit={managerProxy.lastHit} lastAttacked={managerProxy.lastAttacked} x={x} y={y} isDead={isDead} localRef={localRef} id={id} targeted={isTargeted} inAttackRange={inAttackRange}/>
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
    variant?: MOB_VARIANT,
}> = ({id, x, y, variant = MOB_VARIANT.small}) => {

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        addMob(id)
        initMobHealthManager(id, variant)
        setMounted(true)

        return () => {
            deleteMobHealthManager(id)
            removeMob(id)
        }
    }, [])

    if (!mounted) return null

    return <MobInner id={id} x={x} y={y} variant={variant}/>
}

export default Mob;