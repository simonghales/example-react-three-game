import {dynamicBodiesUuids, existingBodies, planckWorld} from "../shared";
import {handleBeginCollision, handleEndCollision} from "./collisions/collisions";

let lastUpdate = 0

export const stepWorld = (positions: Float32Array, angles: Float32Array) => {

    var now = Date.now();
    var delta = !lastUpdate ? 1 / 60 : (now - lastUpdate) / 1000;
    planckWorld.step(delta)
    lastUpdate = now;

    dynamicBodiesUuids.forEach((uuid, index) => {
        const body = existingBodies.get(uuid)
        if (!body) return
        const position = body.getPosition()
        const angle = body.getAngle()
        const velocity = body.getLinearVelocity()
        positions[2 * index + 0] = position.x
        positions[2 * index + 1] = position.y
        angles[index] = angle
    })

}

export const initPhysicsListeners = () => {

    planckWorld.on("begin-contact", (contact) => {
        const fixtureA = contact.getFixtureA()
        const fixtureB = contact.getFixtureB()
        handleBeginCollision(fixtureA, fixtureB)
    })

    planckWorld.on("end-contact", (contact) => {
        const fixtureA = contact.getFixtureA();
        const fixtureB = contact.getFixtureB();
        handleEndCollision(fixtureA, fixtureB)
    })

}
