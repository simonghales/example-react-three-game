import React from "react"
import {roomWalls} from "../../../temp/rooms";
import RoomWall from "./components/RoomWall/RoomWall";

const Room: React.FC = () => {

    const walls = roomWalls

    return (
        <group position={[-4, 0, -3]}>
            {walls.map((wall, index) => (
                <RoomWall wall={wall} index={index} key={index} />
            ))}
        </group>
    )
}

export default Room