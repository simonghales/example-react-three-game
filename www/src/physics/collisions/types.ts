
export enum FixtureType {
    PLAYER_RANGE,
    MOB
}

export type FixtureUserData = {
    uuid: string,
    fixtureIndex: number,
    type: FixtureType,
    [key: string]: any,
}