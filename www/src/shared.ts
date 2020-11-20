import {World, Vec2, Body} from "planck-js";

export const planckWorld = World({
    gravity: Vec2(0, 0)
})

export const dynamicBodiesUuids: string[] = []

export const existingBodies = new Map<string, Body>()