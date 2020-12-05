import { Box } from "@react-three/drei";
import React, {Suspense} from "react"
import {RoomDirection, RoomWallMdl} from "../../../../../temp/rooms";
import {radians} from "../../../../../utils/angles";
import Wall from "../../../../../3d/models/Wall/Wall";

const IndividualWall: React.FC<{
    index: number,
    position: number,
    vertical: boolean,
}> = ({position, index, vertical}) => {
    return (
        <group position={[position, index / 10000, index / 10000]}>
            <Box position={[(4 / 2), 0, 0]} args={[4 - 1 / 10000, 7.75, 1]} castShadow>
                <meshBasicMaterial depthWrite={false} colorWrite={false} />
            </Box>
            <Suspense fallback={null}>
                <Wall position={[(4 / 2), 0, 0]}/>
            </Suspense>
        </group>
    )
}

const RoomWall: React.FC<{
    wall: RoomWallMdl,
    index: number,
}> = ({wall, index}) => {
    const horizontal = wall.start[0] !== wall.end[0];
    let wallLength = Math.abs(
        wall.start[horizontal ? 0 : 1] - wall.end[horizontal ? 0 : 1]
    );
    const numberOfWalls = Math.ceil(wallLength / 4);
    const wallRemainder = 4 - (wallLength % 4);
    let xStart = wall.start[0]
    let yStart = horizontal ? wall.start[1] : wall.start[1] + wallLength
    switch (wall.direction) {
        case RoomDirection.NORTH:
            yStart -= 0.725
            break
        case RoomDirection.EAST:
            xStart -= 0.725
            break
        case RoomDirection.SOUTH:
            yStart += 0.725
            break
        case RoomDirection.WEST:
            xStart += 0.725
            break
    }
    return (
        <group position={[xStart, index / 10000, yStart]} rotation={[0, horizontal ? 0 : radians(90), 0]}>
            {Array.from({ length: numberOfWalls }).map((_, wallIndex) => {
                let position = wallIndex * 4;
                if (wallIndex === numberOfWalls - 1 && wallRemainder !== 4) {
                    position -= wallRemainder;
                }
                return <IndividualWall position={position} index={wallIndex} key={wallIndex} vertical={!horizontal} />;
            })}
        </group>
    )
}

export default RoomWall