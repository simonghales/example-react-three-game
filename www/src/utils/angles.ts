export const radians = (degrees: number): number => {
    return (degrees * Math.PI) / 180
}

export const rotateVector = (x: number, y: number, degrees: number): [number, number] => {
    const rad = radians(degrees)
    const sin = Math.sin(rad)
    const cos = Math.cos(rad)

    const adjustedX = (cos * x) - (sin * y)
    const adjustedY = (sin * x) + (cos * y)

    return [adjustedX, adjustedY]
}
