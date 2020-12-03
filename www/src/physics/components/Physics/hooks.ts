import {Object3D} from "three";
import {MutableRefObject, useLayoutEffect, useMemo, useRef, useState} from "react";
import {workerAddBody, workerRemoveBody, workerSetBody, workerUpdateBody} from "./worker";
import {AddBodyDef, BodyType, UpdateBodyData} from "../../bodies";
import {Vec2} from "planck-js";
import {useFrame} from "react-three-fiber";
import {applyPositionAngle, buffers, collisionEndedEvents, collisionStartedEvents, storedPhysicsData} from "./data";
import {PhysicsCacheKeys} from "../../cache";

export type BodyApi = {
    applyForceToCenter: (vec: Vec2) => void,
    applyLinearImpulse: (vec: Vec2, pos: Vec2) => void,
    setPosition: (vec: Vec2) => void,
    setLinearVelocity: (vec: Vec2) => void,
    setAngle: (angle: number) => void,
    updateBody: (data: UpdateBodyData) => void,
}

export const useBody = (propsFn: () => AddBodyDef, {
    applyAngle = false,
    cacheKey,
    uuid: passedUUID,
    fwdRef,
    onCollideEnd,
    onCollideStart,
    debug
}: {
    applyAngle?: boolean,
    cacheKey?: PhysicsCacheKeys,
    uuid?: string,
    fwdRef?: MutableRefObject<Object3D>,
    onCollideStart?: (data: any, fixtureIndex: number) => void,
    onCollideEnd?: (data: any, fixtureIndex: number) => void,
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
            cacheKey,
            ...props,
        })

        return () => {

            if (listenForCollisions) {
                delete collisionStartedEvents[uuid]
                delete collisionEndedEvents[uuid]
            }

            workerRemoveBody({uuid, cacheKey})
        }

    }, [])

    useFrame(() => {
        if (!isDynamic) {
            return
        }
        if (ref.current && buffers.positions.length && buffers.angles.length) {
            const index = storedPhysicsData.bodies[uuid]
            applyPositionAngle(ref.current, index, applyAngle, debug)
        }
    })

    const api = useMemo<BodyApi>(() => {

        const getUUID = () => uuid

        return  {
            applyForceToCenter: (vec) => {
                workerSetBody({uuid: getUUID(), method: 'applyForceToCenter', methodParams: [vec, true]})
            },
            applyLinearImpulse: (vec, pos) => {
                workerSetBody({uuid: getUUID(), method: 'applyLinearImpulse', methodParams: [vec, pos, true]})
            },
            setPosition: (vec) => {
                workerSetBody({uuid: getUUID(), method: 'setPosition', methodParams: [vec]})
            },
            setLinearVelocity: (vec) => {
                workerSetBody({uuid: getUUID(), method: 'setLinearVelocity', methodParams: [vec]})
            },
            updateBody: (data: UpdateBodyData) => {
                workerUpdateBody({uuid: getUUID(), data})
            },
            setAngle: (angle: number) => {
                workerSetBody({uuid: getUUID(), method: 'setAngle', methodParams: [angle]})
            }
        }
    }, [])

    return [ref, api]
}