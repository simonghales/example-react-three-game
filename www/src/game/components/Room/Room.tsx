import React from "react"
import {RoomDirection, roomWalls} from "../../../temp/rooms";
import RoomWall from "./components/RoomWall/RoomWall";
import {useBody} from "../../../physics/components/Physics/hooks";
import {BodyShape, BodyType} from "../../../physics/bodies";
import {Vec2} from "planck-js";
import {COLLISION_FILTER_GROUPS} from "../../../physics/collisions/filters";
import {radians} from "../../../utils/angles";

const Room: React.FC = () => {

    const [x, y] = [-4, -3]

    const walls = roomWalls

    useBody(() => ({
        type: BodyType.static,
        position: Vec2(x, y),
        fixtures: walls.map((wall) => {
            const horizontal = wall.direction === RoomDirection.NORTH || wall.direction === RoomDirection.SOUTH
            const xLength = horizontal ? Math.abs(wall.start[0] - wall.end[0]) : 1.2
            const yLength = horizontal ? 1.2 : Math.abs(wall.start[1] - wall.end[1])
            let xStart = wall.start[0] + xLength / 2
            let yStart = wall.start[1] + yLength / 2
            switch (wall.direction) {
                case RoomDirection.NORTH:
                    yStart -= 1.25
                    break
                case RoomDirection.EAST:
                    xStart -= 1.25
                    break
                case RoomDirection.SOUTH:
                    yStart += 0
                    break
                case RoomDirection.WEST:
                    xStart += 0
                    break
            }
            return {
                shape: BodyShape.box,
                hx: xLength,
                hy: yLength,
                center: [xStart, yStart],
                fixtureOptions: {
                    filterCategoryBits: COLLISION_FILTER_GROUPS.barrier,
                    filterMaskBits: COLLISION_FILTER_GROUPS.physical,
                }
            }
        }),
    }), {})

    return (
        <group position={[x, 0, y]}>
            {walls.map((wall, index) => (
                <RoomWall wall={wall} index={index} key={index} />
            ))}
        </group>
    )
}

export default Room