// utils/colorGenerator.ts

function calculateHueDistance(hue1: number, hue2: number): number {
    let distance = Math.abs(hue1 - hue2)
    if (distance > 180) distance = 360 - distance // Account for circular hue values
    return distance
}

export function generateADHDFriendlyColors(existingColors: string[]): {
    color: string
    bgColor: string
} {
    let color: string = ''
    let bgColor: string = ''
    let isUnique = false
    const minHueDistance = 30 // Minimum hue distance to ensure distinct colours

    while (!isUnique) {
        const hue = Math.floor(Math.random() * 360)
        const pastelSaturation = 70
        const pastelLightness = 85

        color = `hsl(${hue}, ${pastelSaturation}%, ${pastelLightness}%)`

        // Check the hue distance against existing colors
        const existingHues = existingColors.map(existingColor => {
            const match = existingColor.match(/hsl\((\d+),/)
            return match ? parseInt(match[1], 10) : 0
        })

        isUnique = existingHues.every(
            existingHue =>
                calculateHueDistance(hue, existingHue) >= minHueDistance
        )

        if (isUnique) {
            const bgLightness = 40
            bgColor = `hsl(${hue}, ${pastelSaturation}%, ${bgLightness}%)`
        }
    }

    return { color, bgColor }
}
