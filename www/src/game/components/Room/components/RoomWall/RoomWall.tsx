import { Box } from "@react-three/drei";
import React from "react"
import {RoomWallMdl} from "../../../../../temp/rooms";
import {radians} from "../../../../../utils/angles";

const IndividualWall: React.FC<{
    index: number,
    position: number,
    vertical: boolean,
}> = ({position, index, vertical}) => {
    return (
        <group position={[position, index / 10000, index / 10000]}>
            <Box position={[(4 / 2), 0, 0]} args={[4, 8, 1]}>
                <meshBasicMaterial transparent opacity={0.5} color={vertical ? "blue" : "red"} />
            </Box>
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
    console.log('wall', wall, horizontal, numberOfWalls)
    const xStart = wall.start[0]
    const yStart = horizontal ? wall.start[1] : wall.start[1] + wallLength
    console.log('x', xStart, wall.start[0], wallLength)
    return (
        <group position={[xStart, index / 10000, yStart]} rotation={[0, horizontal ? 0 : radians(90), 0]}>
            {Array.from({ length: numberOfWalls }).map((_, wallIndex) => {
                let position = wallIndex * 4;
                if (wallIndex === numberOfWalls - 1 && wallRemainder !== 4) {
                    console.log('reduce position', wallIndex, position, wallRemainder)
                    position -= wallRemainder;
                }
                console.log('position', position)
                return <IndividualWall position={position} index={wallIndex} key={wallIndex} vertical={!horizontal} />;
            })}
        </group>
    )
}

export default RoomWall