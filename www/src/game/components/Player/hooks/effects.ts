import {useEffect} from "react";
import {subscribe} from "valtio";
import {playerEnergy} from "../../../../state/player";

let energyLastUsed = 0
let rechargeInterval: any;
let rechargeTimeout: any;
const rechargeDelay = 1500

const restartEnergyRechargeProcess = () => {

    energyLastUsed = Date.now()

    if (rechargeInterval) {
        clearInterval(rechargeInterval)
        rechargeInterval = null
    }

    if (!rechargeTimeout) {

        console.log('starting a timeout...')

        const startTimeout = (delay: number) => {

            rechargeTimeout = setTimeout(() => {

                const now = Date.now()

                if (now >= energyLastUsed + rechargeDelay) {

                    rechargeInterval = setInterval(() => {

                        let energy = playerEnergy.energy

                        energy += 7

                        if (energy >= 100) {
                            energy = 100
                            clearInterval(rechargeInterval)
                        }

                        playerEnergy.energy = energy

                    }, 100)

                    clearTimeout(rechargeTimeout)
                    rechargeTimeout = null
                } else {
                    startTimeout((energyLastUsed + rechargeDelay) - now)
                }

            }, delay)

        }

        startTimeout(rechargeDelay)


    }

}

export const usePlayerEffectsHandler = () => {

    useEffect(() => {

        let previousEnergy = playerEnergy.energy

        const unsubscribe = subscribe(playerEnergy, () => {
            const energy = playerEnergy.energy
            if (energy < previousEnergy) {
                restartEnergyRechargeProcess()
            }
            previousEnergy = energy
        })
        return () => {
            unsubscribe()
        }

    }, [])

}