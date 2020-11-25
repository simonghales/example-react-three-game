import {useWindowSize} from "@react-hook/window-size";

export const useIsPortrait = (): boolean => {
    const [width, height] = useWindowSize()
    return height > width
}