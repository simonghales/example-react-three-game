import {Fixture} from "planck-js";
import {FixtureUserData} from "./types";
import {sendCollisionBeginEvent, sendCollisionEndEvent} from "../../workers/physics/functions";

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

    if (aUUID) {
        sendCollisionBeginEvent(aUUID, fixtureB.getUserData())
    }

    if (bUUID) {
        sendCollisionBeginEvent(bUUID, fixtureA.getUserData())
    }
}

export const handleEndCollision = (fixtureA: Fixture, fixtureB: Fixture) => {
    const aUUID = getFixtureUuid(fixtureA)
    const bUUID = getFixtureUuid(fixtureB)

    if (aUUID) {
        sendCollisionEndEvent(aUUID, fixtureB.getUserData())
    }

    if (bUUID) {
        sendCollisionEndEvent(bUUID, fixtureA.getUserData())
    }
}