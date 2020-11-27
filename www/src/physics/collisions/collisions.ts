import {Fixture} from "planck-js";
import {FixtureUserData} from "./types";
import {sendCollisionBeginEvent, sendCollisionEndEvent} from "../../workers/physics/functions";
import {activeCollisionListeners} from "./data";

const getFixtureData = (fixture: Fixture): FixtureUserData | null => {
    const userData = fixture.getUserData() as null | FixtureUserData
    return userData || null
}

const getFixtureUuid = (data: FixtureUserData | null): string => {
    if (data && data['uuid']) {
        return data.uuid
    }
    return ''
}

const getFixtureIndex = (data: FixtureUserData | null): number => {
    if (data) {
        return data.fixtureIndex
    }
    return -1
}

export const handleBeginCollision = (fixtureA: Fixture, fixtureB: Fixture) => {
    const aData = getFixtureData(fixtureA)
    const bData = getFixtureData(fixtureB)
    const aUUID = getFixtureUuid(aData)
    const bUUID = getFixtureUuid(bData)

    if (aUUID && activeCollisionListeners[aUUID]) {
        sendCollisionBeginEvent(aUUID, bData, getFixtureIndex(aData))
    }

    if (bUUID && activeCollisionListeners[bUUID]) {
        sendCollisionBeginEvent(bUUID, aData, getFixtureIndex(bData))
    }
}

export const handleEndCollision = (fixtureA: Fixture, fixtureB: Fixture) => {
    const aData = getFixtureData(fixtureA)
    const bData = getFixtureData(fixtureB)
    const aUUID = getFixtureUuid(aData)
    const bUUID = getFixtureUuid(bData)

    if (aUUID && activeCollisionListeners[aUUID]) {
        sendCollisionEndEvent(aUUID, bData, getFixtureIndex(aData))
    }

    if (bUUID && activeCollisionListeners[bUUID]) {
        sendCollisionEndEvent(bUUID, aData, getFixtureIndex(bData))
    }
}