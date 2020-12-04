import {useProxy} from "valtio";
import {playerVisualState} from "../components/PlayerVisuals/PlayerVisuals";
import {useEffect} from "react";
import {BodyApi} from "../../../../physics/components/Physics/hooks";
import {COLLISION_FILTER_GROUPS} from "../../../../physics/collisions/filters";

export const usePlayerCollisionsHandler = (api: BodyApi) => {

    const rolling = useProxy(playerVisualState).rolling

    useEffect(() => {

       // if (rolling) {
       //      api.updateBody({
       //          fixtureUpdate: {
       //              maskBits: 0
       //          }
       //      })
       // } else {
       //     api.updateBody({
       //         fixtureUpdate: {
       //             maskBits: COLLISION_FILTER_GROUPS.mob,
       //         }
       //     })
       // }

    }, [rolling])

}