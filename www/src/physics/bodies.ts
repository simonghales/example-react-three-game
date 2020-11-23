import {BodyDef, Box, Circle, FixtureOpt, Vec2} from "planck-js";
import {dynamicBodiesUuids, existingBodies, planckWorld} from "../shared";
import {Shape} from "planck-js/lib/shape";
import {syncBodies} from "../workers/physics/functions";
import {activeCollisionListeners} from "./collisions/data";

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
}

export const addBody = ({uuid, listenForCollisions, shape, fixtureOptions = {}, ...props}: AddBodyProps) => {

    const existingBody = existingBodies.get(uuid)

    if (existingBody) {
        return existingBody
    }

    if (listenForCollisions) {
        activeCollisionListeners[uuid] = true
    }

    const bodyDef: BodyDef = {
        type: BodyType.static,
        fixedRotation: true,
        ...props,
    }

    const {type} = bodyDef

    const body = planckWorld.createBody(bodyDef)

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

    fixtureOptions = {
        userData: {
          uuid,
          ...fixtureOptions?.userData
        },
        ...fixtureOptions,
    }

    if (fixtureOptions) {
        body.createFixture(bodyShape, fixtureOptions as FixtureOpt)
    } else {
        body.createFixture(bodyShape)
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
}

export const removeBody = ({uuid}: RemoveBodyProps) => {
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
    planckWorld.destroyBody(body)
}

export type SetBodyProps = {
    uuid: string,
    method: string,
    methodParams: any[],
}

const tempVec = Vec2(0, 0)

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