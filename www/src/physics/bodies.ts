import {BodyDef, Body, Box, Circle, FixtureOpt, Vec2} from "planck-js";
import {dynamicBodiesUuids, existingBodies, planckWorld} from "../shared";
import {Shape} from "planck-js/lib/shape";
import {syncBodies} from "../workers/physics/functions";
import {activeCollisionListeners} from "./collisions/data";
import {addCachedBody, getCachedBody, PhysicsCacheKeys} from "./cache";

export enum BodyType {
    static = 'static',
    kinematic = 'kinematic',
    dynamic = 'dynamic'
}

export enum BodyShape {
    box = 'box',
    circle = 'circle',
}

type BasicBodyProps = Partial<BodyDef> & {
    shape: BodyShape,
    fixtureOptions?: Partial<FixtureOpt>,
}

type AddBoxBodyProps = BasicBodyProps & {
    hx: number,
    hy: number,
}

type AddCircleBodyProps = BasicBodyProps & {
    radius: number,
}

export type AddBodyDef = BasicBodyProps | AddBoxBodyProps | AddCircleBodyProps

export type AddBodyProps = AddBodyDef & {
    uuid: string,
    listenForCollisions: boolean,
    cacheKey?: PhysicsCacheKeys
}

export const addBody = ({uuid, cacheKey, listenForCollisions, shape, fixtureOptions = {}, ...props}: AddBodyProps) => {

    const existingBody = existingBodies.get(uuid)

    if (existingBody) {
        return existingBody
    }

    if (listenForCollisions) {
        activeCollisionListeners[uuid] = true
    }

    fixtureOptions = {
        userData: {
            uuid,
            ...fixtureOptions?.userData
        },
        ...fixtureOptions,
    }

    const bodyDef: BodyDef = {
        type: BodyType.static,
        fixedRotation: true,
        ...props,
    }

    const {type} = bodyDef

    let body: Body | null = null;

    if (cacheKey) {
        const cachedBody = getCachedBody(cacheKey)
        if (cachedBody) {

            if (fixtureOptions) {
                const fixture = cachedBody.getFixtureList()
                if (fixture) {
                    fixture.setUserData(fixtureOptions.userData)
                }
            }

            const {position, angle} = props

            if (position) {
                cachedBody.setPosition(position)
            }

            if (angle) {
                cachedBody.setAngle(angle)
            }

            cachedBody.setActive(true)

            body = cachedBody

        }
    }

    if (!body) {

        body = planckWorld.createBody(bodyDef)

        let bodyShape: Shape;

        switch (shape) {
            case BodyShape.box:
                const {hx, hy} = props as AddBoxBodyProps
                bodyShape = Box(hx / 2, hy / 2) as unknown as Shape
                break;
            case BodyShape.circle:
                const {radius} = props as AddCircleBodyProps
                bodyShape = Circle(radius) as unknown as Shape
                break;
            default:
                throw new Error(`Unhandled body shape ${shape}`)
        }

        if (fixtureOptions) {
            body.createFixture(bodyShape, fixtureOptions as FixtureOpt)
        } else {
            body.createFixture(bodyShape)
        }

    }

    if (type !== BodyType.static) {
        dynamicBodiesUuids.push(uuid)
        syncBodies()
    }

    existingBodies.set(uuid, body)

    return body

}

export type RemoveBodyProps = {
    uuid: string,
    cacheKey?: PhysicsCacheKeys
}

const tempVec = Vec2(0, 0)

export const removeBody = ({uuid, cacheKey}: RemoveBodyProps) => {
    const index = dynamicBodiesUuids.indexOf(uuid)
    if (index > -1) {
        dynamicBodiesUuids.splice(index, 1)
        syncBodies()
    }
    const body = existingBodies.get(uuid)
    if (!body) {
        console.warn(`Body not found for ${uuid}`)
        return
    }
    existingBodies.delete(uuid)
    if (cacheKey) {
        tempVec.set(-1000, -1000)
        body.setPosition(tempVec)
        tempVec.set(0, 0)
        body.setLinearVelocity(tempVec)
        body.setActive(false)
        addCachedBody(cacheKey, body)
    } else {
        planckWorld.destroyBody(body)
    }
}

export type SetBodyProps = {
    uuid: string,
    method: string,
    methodParams: any[],
}

export const setBody = ({uuid, method, methodParams}: SetBodyProps) => {
    const body = existingBodies.get(uuid)
    if (!body) {
        console.warn(`Body not found for ${uuid}`)
        return
    }
    switch (method) {
        case 'setLinearVelocity':
            // console.log('methodParams', methodParams[0].x, methodParams[0].y);
            (body as any)[method](...methodParams)
            break;
        default:
            (body as any)[method](...methodParams)
    }
}