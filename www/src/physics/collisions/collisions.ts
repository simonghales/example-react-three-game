import {Fixture} from "planck-js";
import {FixtureUserData} from "./types";
import {sendCollisionBeginEvent, sendCollisionEndEvent} from "../../workers/physics/functions";
import {activeCollisionListeners} from "./data";

const getFixtureUuid = (fixture: Fixture): string => {
    const userData = fixture.getUserData() as null | FixtureUserData
    if (userData && userData['uuid']) {
        return userData.uuid
    }
    return ''
}

export const handleBeginCollision = (fixtureA: Fixture, fixtureB: Fixture) => {
    const aUUID = getFixtureUuid(fixtureA)
    const bUUID = getFixtureUuid(fixtureB)

    if (aUUID && activeCollisionListeners[aUUID]) {
        sendCollisionBeginEvent(aUUID, fixtureB.getUserData())
    }

    if (bUUID && activeCollisionListeners[bUUID]) {
        sendCollisionBeginEvent(bUUID, fixtureA.getUserData())
    }
}

export const handleEndCollision = (fixtureA: Fixture, fixtureB: Fixture) => {
    const aUUID = getFixtureUuid(fixtureA)
    const bUUID = getFixtureUuid(fixtureB)

    if (aUUID && activeCollisionListeners[aUUID]) {
        sendCollisionEndEvent(aUUID, fixtureB.getUserData())
    }

    if (bUUID && activeCollisionListeners[bUUID]) {
        sendCollisionEndEvent(bUUID, fixtureA.getUserData())
    }
}