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
    fixtures: {
        shape: BodyShape,
        fixtureOptions: Partial<FixtureOpt>,
        hx?: number,
        hy?: number,
        center?: [number, number],
        radius?: number,
    }[],
}

type AddBoxBodyProps = BasicBodyProps & {
}

type AddCircleBodyProps = BasicBodyProps & {
}

export type AddBodyDef = BasicBodyProps | AddBoxBodyProps | AddCircleBodyProps

export type AddBodyProps = AddBodyDef & {
    uuid: string,
    listenForCollisions: boolean,
    cacheKey?: PhysicsCacheKeys
}

// todo - add support for multiple fixtures...

export const addBody = ({uuid, cacheKey, listenForCollisions, fixtures = [], ...props}: AddBodyProps) => {

    const existingBody = existingBodies.get(uuid)

    if (existingBody) {
        return existingBody
    }

    if (listenForCollisions) {
        activeCollisionListeners[uuid] = true
    }

    /*
    fixtureOptions = {
        userData: {
            uuid,
            ...fixtureOptions?.userData
        },
        ...fixtureOptions,
    }
     */

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

            if (fixtures && fixtures.length > 0) {

                let bodyFixture = cachedBody.getFixtureList()

                fixtures.forEach((fixture, fixtureIndex) => {

                    let fixtureOptions = fixture.fixtureOptions

                    fixtureOptions = {
                        userData: {
                            uuid,
                            fixtureIndex,
                            ...fixtureOptions?.userData
                        },
                        ...fixtureOptions,
                    }

                    if (bodyFixture) {

                        if (fixtureOptions) {
                            bodyFixture.setUserData(fixtureOptions.userData)
                        }

                        bodyFixture = bodyFixture.getNext()
                    }

                })

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

        if (fixtures && fixtures.length > 0) {

            fixtures.forEach(({shape, fixtureOptions, hx, hy, radius, center}, fixtureIndex) => {

                fixtureOptions = {
                    ...fixtureOptions,
                    userData: {
                        uuid,
                        fixtureIndex,
                        ...fixtureOptions?.userData
                    },
                }

                let bodyShape: Shape;

                switch (shape) {
                    case BodyShape.box:
                        bodyShape = Box((hx as number) / 2, (hy as number) / 2, center ? Vec2(center[0], center[1]): undefined) as unknown as Shape
                        break;
                    case BodyShape.circle:
                        bodyShape = Circle((radius as number)) as unknown as Shape
                        break;
                    default:
                        throw new Error(`Unhandled body shape ${shape}`)
                }

                if (fixtureOptions) {
                    if (body) {
                        body.createFixture(bodyShape, fixtureOptions as FixtureOpt)
                    }
                } else {
                    if (body) {
                        body.createFixture(bodyShape)
                    }
                }

            })


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
        //case 'setAngle':
        //    const [angle] = methodParams
        //    body.setTransform(body.getPosition(), angle)
        //    break;
        case 'setLinearVelocity':
            // console.log('methodParams', methodParams[0].x, methodParams[0].y);
            (body as any)[method](...methodParams)
            break;
        default:
            (body as any)[method](...methodParams)
    }
}

export type UpdateBodyData = {
    fixtureUpdate?: {
        groupIndex?: number,
        categoryBits?: number,
        maskBits?: number,
    }
}

export type UpdateBodyProps = {
    uuid: string,
    data: UpdateBodyData,
}

export const updateBody = ({uuid, data}: UpdateBodyProps) => {
    const body = existingBodies.get(uuid)
    if (!body) {
        console.warn(`Body not found for ${uuid}`)
        return
    }
    const {fixtureUpdate} = data
    if (fixtureUpdate) {
        const fixture = body.getFixtureList()
        if (fixture) {
            const {
                groupIndex,
                categoryBits,
                maskBits
            } = fixtureUpdate
            if (
                groupIndex !== undefined || categoryBits !== undefined || maskBits !== undefined
            ) {
                const originalGroupIndex = fixture.getFilterGroupIndex()
                const originalCategoryBits = fixture.getFilterCategoryBits()
                const originalMaskBits = fixture.getFilterMaskBits()
                fixture.setFilterData({
                    groupIndex: groupIndex !== undefined ? groupIndex : originalGroupIndex,
                    categoryBits: categoryBits !== undefined ? categoryBits : originalCategoryBits,
                    maskBits: maskBits !== undefined ? maskBits : originalMaskBits,
                })
            }
        }
    }
}