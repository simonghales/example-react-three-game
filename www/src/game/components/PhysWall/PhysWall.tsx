import React, {Suspense, useEffect} from "react"
import Wall from "../../../3d/models/Wall/Wall";
import {useBody} from "../../../physics/components/Physics/hooks";
import {BodyShape, BodyType} from "../../../physics/bodies";
import {Vec2} from "planck-js";
import {COLLISION_FILTER_GROUPS} from "../../../physics/collisions/filters";
import WallMesh from "../../../3d/components/WallMesh/WallMesh";
import WallCornerMesh from "../../../3d/components/WallCornerMesh/WallCornerMesh";
import {radians} from "../../../utils/angles";

const PhysWall: React.FC = () => {

    useBody(() => ({
        type: BodyType.static,
        position: Vec2(0, 16),
        fixtures: [
            {
                shape: BodyShape.box,
                hx: 33,
                hy: 1,
                fixtureOptions: {
                    filterCategoryBits: COLLISION_FILTER_GROUPS.barrier,
                    filterMaskBits: COLLISION_FILTER_GROUPS.player,
                },
            }
        ]
    }), {})

    useBody(() => ({
        type: BodyType.static,
        position: Vec2(0, -16),
        fixtures: [
            {
                shape: BodyShape.box,
                hx: 33,
                hy: 1,
                fixtureOptions: {
                    filterCategoryBits: COLLISION_FILTER_GROUPS.barrier,
                    filterMaskBits: COLLISION_FILTER_GROUPS.player,
                },
            }
        ]
    }), {})

    useBody(() => ({
        type: BodyType.static,
        position: Vec2(16, 0),
        fixtures: [
            {
                shape: BodyShape.box,
                hx: 1,
                hy: 33,
                fixtureOptions: {
                    filterCategoryBits: COLLISION_FILTER_GROUPS.barrier,
                    filterMaskBits: COLLISION_FILTER_GROUPS.player,
                },
            }
        ]
    }), {})

    useBody(() => ({
        type: BodyType.static,
        position: Vec2(-16, 0),
        fixtures: [
            {
                shape: BodyShape.box,
                hx: 1,
                hy: 33,
                fixtureOptions: {
                    filterCategoryBits: COLLISION_FILTER_GROUPS.barrier,
                    filterMaskBits: COLLISION_FILTER_GROUPS.player,
                },
            }
        ]
    }), {})

    return (
        <>
            <WallCornerMesh rotation={[0, radians(180), 0]} position={[-16, 0, 16]}/>
            <WallCornerMesh rotation={[0, radians(270), 0]} position={[16, 0, 16]}/>
            <WallCornerMesh rotation={[0, radians(90), 0]} position={[-16, 0, -16]}/>
            <WallCornerMesh rotation={[0, radians(0), 0]} position={[16, 0, -16]}/>
            <group position={[0, 0, 16]}>
                <WallMesh position={[-4, 0, 0]}/>
                <WallMesh position={[4, 0, 0]}/>
                <WallMesh position={[0, 0, 0]}/>
                <WallMesh position={[-8, 0, 0]}/>
                <WallMesh position={[8, 0, 0]}/>
                <WallMesh position={[-12, 0, 0]}/>
                <WallMesh position={[12, 0, 0]}/>
            </group>
            <group position={[0, 0, -16]}>
                <WallMesh position={[-4, 0, 0]}/>
                <WallMesh position={[4, 0, 0]}/>
                <WallMesh position={[0, 0, 0]}/>
                <WallMesh position={[-8, 0, 0]}/>
                <WallMesh position={[8, 0, 0]}/>
                <WallMesh position={[-12, 0, 0]}/>
                <WallMesh position={[12, 0, 0]}/>
            </group>
            <group position={[16, 0, 0]} rotation={[0, radians(90), 0]}>
                <WallMesh position={[-4, 0, 0]}/>
                <WallMesh position={[4, 0, 0]}/>
                <WallMesh position={[0, 0, 0]}/>
                <WallMesh position={[-8, 0, 0]}/>
                <WallMesh position={[8, 0, 0]}/>
                <WallMesh position={[-12, 0, 0]}/>
                <WallMesh position={[12, 0, 0]}/>
            </group>
            <group position={[-16, 0, 0]} rotation={[0, radians(90), 0]}>
                <WallMesh position={[-4, 0, 0]}/>
                <WallMesh position={[4, 0, 0]}/>
                <WallMesh position={[0, 0, 0]}/>
                <WallMesh position={[-8, 0, 0]}/>
                <WallMesh position={[8, 0, 0]}/>
                <WallMesh position={[-12, 0, 0]}/>
                <WallMesh position={[12, 0, 0]}/>
            </group>
        </>
    )
}

export default PhysWall