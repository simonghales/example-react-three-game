import {useProxy} from "valtio";
import {playerHealth, playerState} from "../../../../state/player";
import {useEffect} from "react";

export const usePlayerStateHandler = () => {

    const {lastDamaged, health} = useProxy(playerHealth)

    useEffect(() => {

        if (lastDamaged > 0) {

            playerState.invincible = true

            const timeout = setTimeout(() => {

                playerState.invincible = false

            }, 1000)

            return () => {
                clearTimeout(timeout)
            }

        }

    }, [lastDamaged])

}