import { loadUsedColors } from '../db' // Import function to load used colors

function calculateHueDistance(hue1: number, hue2: number): number {
    let distance = Math.abs(hue1 - hue2)
    if (distance > 180) distance = 360 - distance // Account for circular hue values
    return distance
}

function hslToHex(h: number, s: number, l: number): string {
    l /= 100
    const a = (s * Math.min(l, 1 - l)) / 100
    const f = (n: number) => {
        const k = (n + h / 30) % 12
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
        return Math.round(255 * color)
            .toString(16)
            .padStart(2, '0')
    }
    return `#${f(0)}${f(8)}${f(4)}`
}

export async function generateADHDFriendlyColors(): Promise<{
    color: string
    bgColor: string
}> {
    let color: string = ''
    let bgColor: string = ''
    let isUnique = false
    const minHueDistance = 30 // Minimum hue distance to ensure distinct colours

    // Fetch existing colors from the database
    const usedHues = (await loadUsedColors()).map(usedColor => usedColor.h)

    while (!isUnique) {
        const hue = Math.floor(Math.random() * 360)
        const pastelSaturation = 70
        const pastelLightness = 85

        // Check if this hue is unique based on the minimum hue distance
        isUnique = usedHues.every(
            existingHue =>
                calculateHueDistance(hue, existingHue) >= minHueDistance
        )

        if (isUnique) {
            color = hslToHex(hue, pastelSaturation, pastelLightness)
            const bgLightness = 40
            bgColor = hslToHex(hue, pastelSaturation, bgLightness)
        }
    }

    return { color, bgColor }
}
