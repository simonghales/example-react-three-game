import {useEffect} from "react";
import {processMobsAI} from "../../../../../../temp/ai";

export const useGameAiHandler = () => {

    useEffect(() => {

        setInterval(() => {
            processMobsAI()
        }, 1000 / 30)

    }, [])

}