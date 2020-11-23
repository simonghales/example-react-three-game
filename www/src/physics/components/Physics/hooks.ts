import {Object3D} from "three";
import {MutableRefObject, useLayoutEffect, useMemo, useRef, useState} from "react";
import {workerAddBody, workerRemoveBody, workerSetBody} from "./worker";
import {AddBodyDef, BodyType} from "../../bodies";
import {Vec2} from "planck-js";
import {useFrame} from "react-three-fiber";
import {applyPositionAngle, buffers, collisionEndedEvents, collisionStartedEvents, storedPhysicsData} from "../../data";

export type BodyApi = {
    setPosition: (vec: Vec2) => void,
    setLinearVelocity: (vec: Vec2) => void
}

export const useBody = (propsFn: () => AddBodyDef, {
    uuid: passedUUID,
    fwdRef,
    onCollideEnd,
    onCollideStart,
    debug
}: {
    uuid?: string,
    fwdRef?: MutableRefObject<Object3D>,
    onCollideStart?: (data: any) => void,
    onCollideEnd?: (data: any) => void,
    debug?: string
}): [any, BodyApi] => {
    const localRef = useRef<Object3D>((null as unknown) as Object3D)
    const ref = fwdRef ? fwdRef : localRef
    const [uuid] = useState(() => {
        if (passedUUID) return passedUUID
        if (!ref.current) {
            ref.current = new Object3D()
        }
        return ref.current.uuid
    })
    const [isDynamic] = useState(() => {
        const props = propsFn()
        return props.type !== BodyType.static
    })

    useLayoutEffect(() => {

        const props = propsFn()

        ref.current.position.x = props.position?.x || 0
        ref.current.position.z = props.position?.y || 0

        const listenForCollisions = !!onCollideStart || !!onCollideEnd

        if (listenForCollisions) {
            collisionStartedEvents[uuid] = onCollideStart ? onCollideStart : () => {}
            collisionEndedEvents[uuid] = onCollideEnd ? onCollideEnd : () => {}
        }

        workerAddBody({
            uuid,
            listenForCollisions,
            ...props,
        })

        return () => {

            if (listenForCollisions) {
                delete collisionStartedEvents[uuid]
                delete collisionEndedEvents[uuid]
            }

            workerRemoveBody(uuid)
        }

    }, [])

    useFrame(() => {
        if (!isDynamic) {
            return
        }
        if (ref.current && buffers.positions.length && buffers.angles.length) {
            const index = storedPhysicsData.bodies[uuid]
            applyPositionAngle(ref.current, index, false, debug)
        }
    })

    const api = useMemo<BodyApi>(() => {

        const getUUID = () => uuid

        return  {
            setPosition: (vec) => {
                workerSetBody({uuid: getUUID(), method: 'setPosition', methodParams: [vec]})
            },
            setLinearVelocity: (vec) => {
                workerSetBody({uuid: getUUID(), method: 'setLinearVelocity', methodParams: [vec]})
            }
        }
    }, [])

    return [ref, api]
}