export const plusOrMinus = (num: number): number => {
    if (num > 0.5) return 1
    return -1
}

export const numLerp = (v0: number, v1: number, t: number): number => {
    return v0*(1-t)+v1*t
}

export const PI = 3.14159265359
export const PI_TIMES_TWO = 6.28318530718

export const lerpRadians = (a: number, b: number, lerpFactor: number): number => // Lerps from angle a to b (both between 0.f and PI_TIMES_TWO), taking the shortest path
{
    let result: number;
    let diff: number = b - a;
    if (diff < -PI)
    {
        // lerp upwards past PI_TIMES_TWO
        b += PI_TIMES_TWO;
        result = numLerp(a, b, lerpFactor);
        if (result >= PI_TIMES_TWO)
        {
            result -= PI_TIMES_TWO;
        }
    }
    else if (diff > PI)
    {
        // lerp downwards past 0
        b -= PI_TIMES_TWO;
        result = numLerp(a, b, lerpFactor);
        if (result < 0)
        {
            result += PI_TIMES_TWO;
        }
    }
    else
    {
        // straight lerp
        result = numLerp(a, b, lerpFactor);
    }

    return result;
}