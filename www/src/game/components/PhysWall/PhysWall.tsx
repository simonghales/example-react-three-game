import React, {Suspense, useEffect} from "react"
import Wall from "../../../3d/models/Wall/Wall";
import {useBody} from "../../../physics/components/Physics/hooks";
import {BodyShape, BodyType} from "../../../physics/bodies";
import {Vec2} from "planck-js";
import {COLLISION_FILTER_GROUPS} from "../../../physics/collisions/filters";

const PhysWall: React.FC = () => {

    useBody(() => ({
        type: BodyType.static,
        position: Vec2(0, 16),
        fixtures: [
            {
                shape: BodyShape.box,
                hx: 36,
                hy: 1,
                fixtureOptions: {
                    filterCategoryBits: COLLISION_FILTER_GROUPS.barrier,
                    filterMaskBits: COLLISION_FILTER_GROUPS.player,
                },
            }
        ]
    }), {})

    return (
        <Suspense fallback={null}>
            <Wall position={[-4, 0, 16]}/>
            <Wall position={[4, 0, 16]}/>
            <Wall position={[0, 0, 16]}/>
            <Wall position={[-8, 0, 16]}/>
            <Wall position={[8, 0, 16]}/>
            <Wall position={[-12, 0, 16]}/>
            <Wall position={[12, 0, 16]}/>
            <Wall position={[-16, 0, 16]}/>
            <Wall position={[16, 0, 16]}/>
        </Suspense>
    )
}

export default PhysWall