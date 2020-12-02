type RoomDoor = [[number, number], [number, number]];

const room: {
    width: number;
    height: number;
    door: RoomDoor;
} = {
    width: 30,
    height: 25,
    door: [
        [5, 0],
        [8, 0]
    ]
};

export enum RoomDirection {
    NORTH,
    EAST,
    SOUTH,
    WEST
}

export type RoomWallMdl = {
    direction: RoomDirection,
    start: [number, number];
    end: [number, number];
};

const spaceIsClear = (x: number, y: number, door: RoomDoor): boolean => {
    return !(
        x >= door[0][0] &&
        x <= door[1][0] &&
        y >= door[0][1] &&
        y <= door[1][1]
    );
};

const getWalls = (
    [startX, startY]: [number, number],
    [endX, endY]: [number, number],
    door: RoomDoor,
    direction: RoomDirection,
): RoomWallMdl[] => {
    let walls: RoomWallMdl[] = [];

    let horizontal = startX !== endX;

    let currentWall: null | {
        start: [number, number];
    } = null;

    const addCurrentWall = (x: number, y: number) => {
        if (currentWall) {
            walls.push({
                direction,
                start: currentWall.start,
                end: [x, y]
            });
            currentWall = null;
        }
    };

    const processSpot = (x: number, y: number) => {
        if (spaceIsClear(x, y, door)) {
            if (!currentWall) {
                currentWall = {
                    start: [x, y]
                };
            }
        } else {
            if (currentWall) {
                addCurrentWall(x, y);
            }
        }
    };

    if (horizontal) {
        const start = startX < endX ? startX : endX;
        const end = endX > startX ? endX : startX;
        const y = startY;
        for (let x = start; x < end; x++) {
            processSpot(x, y);
        }
        if (currentWall) {
            addCurrentWall(end, y);
        }
    } else {
        const x = startX;
        const start = startY < endY ? startY : endY;
        const end = endY > startY ? endY : startY;
        for (let y = start; y < end; y++) {
            processSpot(x, y);
        }
        if (currentWall) {
            addCurrentWall(x, end);
        }
    }

    return walls;
};

const getRoomWalls = (): RoomWallMdl[] => {
    let walls: RoomWallMdl[] = [];

    walls.push(...getWalls([0, 0], [room.width, 0], room.door, RoomDirection.NORTH));
    walls.push(
        ...getWalls([room.width, 0], [room.width, room.height], room.door, RoomDirection.EAST)
    );
    walls.push(
        ...getWalls([room.width, room.height], [0, room.height], room.door, RoomDirection.SOUTH)
    );
    walls.push(...getWalls([0, room.height], [0, 0], room.door, RoomDirection.WEST));

    return walls;
};

export const roomWalls = getRoomWalls();