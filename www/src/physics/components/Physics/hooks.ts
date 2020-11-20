import {Object3D} from "three";
import {useLayoutEffect, useMemo, useRef} from "react";
import {workerAddBody, workerRemoveBody, workerSetBody} from "./worker";
import {AddBodyDef} from "../../bodies";
import {Vec2} from "planck-js";
import {useFrame} from "react-three-fiber";
import {applyPositionAngle, buffers, collisionEndedEvents, collisionStartedEvents, storedPhysicsData} from "../../data";

export type BodyApi = {
    setPosition: (vec: Vec2) => void,
    setLinearVelocity: (vec: Vec2) => void
}

export const useBody = (propsFn: () => AddBodyDef, onCollideStart?: () => void, onCollideEnd?: () => void): [any, BodyApi] => {
    const localRef = useRef<Object3D>((null as unknown) as Object3D)
    let ref = localRef

    useLayoutEffect(() => {

        if (!ref.current) {
            ref.current = new Object3D()
        }

        const object = ref.current
        const uuid = object.uuid
        const listenForCollisions = !!onCollideStart && !!onCollideEnd

        if (listenForCollisions) {
            collisionStartedEvents[uuid] = onCollideStart ? onCollideStart : () => {}
            collisionEndedEvents[uuid] = onCollideEnd ? onCollideEnd : () => {}
        }

        workerAddBody({
            uuid,
            listenForCollisions,
            ...propsFn(),
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
        if (ref.current && buffers.positions.length && buffers.angles.length) {
            const index = storedPhysicsData.bodies[ref.current.uuid]
            applyPositionAngle(ref.current, index)
        }
    })

    const api = useMemo<BodyApi>(() => {

        const getUUID = () => ref.current.uuid

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