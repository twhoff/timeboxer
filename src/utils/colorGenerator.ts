import { getRotatorValue, setRotatorValue, loadUsedColors } from '../db'

// Define the UsedColor interface
interface UsedColor {
    color: string
    h: number
    s: number
    l: number
}

export const GOLDEN_ANGLE = 137.5 // Golden angle in degrees
export const MAX_HUE = 360 // Maximum hue value

export function generateAtlassianStyleColor(hue: number): {
    accentColor: string
    backgroundColor: string
} {
    const accentSaturation = 80
    const accentLightness = 45
    const backgroundSaturation = 40
    const backgroundLightness = 90

    const accentColor = hslToHex(hue, accentSaturation, accentLightness)
    const backgroundColor = hslToHex(
        hue,
        backgroundSaturation,
        backgroundLightness
    )

    return { accentColor, backgroundColor }
}

async function getNextHue(): Promise<number> {
    const currentRotator = await getRotatorValue()
    const nextHue = (currentRotator + GOLDEN_ANGLE) % MAX_HUE
    await setRotatorValue(nextHue) // Update the rotator value
    return nextHue
}

export async function generateADHDFriendlyColors(
    inputHue: number | null = null
): Promise<{
    color: string
    bgColor: string
}> {
    const minHueDistance = 100
    const minColorDifference = 100

    const usedColors: UsedColor[] = await loadUsedColors()

    let accentColor = ''
    let backgroundColor = ''
    let isUnique = false

    while (!isUnique) {
        const hue = inputHue || (await getNextHue())
        const {
            accentColor: newAccentColor,
            backgroundColor: newBackgroundColor,
        } = generateAtlassianStyleColor(hue)
        const newColor: UsedColor = hexToHSL(newAccentColor)

        isUnique =
            usedColors.every(
                existingColor =>
                    calculateHueDistance(newColor.h, existingColor.h) >=
                        minHueDistance &&
                    calculateColorDifference(newColor, existingColor) >=
                        minColorDifference
            ) && newAccentColor !== newBackgroundColor

        if (isUnique) {
            accentColor = newAccentColor
            backgroundColor = newBackgroundColor
            usedColors.push(newColor)
        }
    }

    return { color: accentColor, bgColor: backgroundColor }
}

export function hslToHex(h: number, s: number, l: number): string {
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

function calculateHueDistance(hue1: number, hue2: number): number {
    let distance = Math.abs(hue1 - hue2)
    if (distance > 180) distance = 360 - distance
    return distance
}

function calculateColorDifference(c1: UsedColor, c2: UsedColor): number {
    return Math.sqrt(
        (c1.h - c2.h) ** 2 + (c1.s - c2.s) ** 2 + (c1.l - c2.l) ** 2
    )
}

function hexToHSL(hex: string): UsedColor {
    let r = 0,
        g = 0,
        b = 0
    if (hex.length === 7) {
        r = parseInt(hex.slice(1, 3), 16)
        g = parseInt(hex.slice(3, 5), 16)
        b = parseInt(hex.slice(5, 7), 16)
    }
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b),
        min = Math.min(r, g, b)
    let h = 0,
        s = 0
    const l = (max + min) / 2
    if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0)
                break
            case g:
                h = (b - r) / d + 2
                break
            case b:
                h = (r - g) / d + 4
                break
        }
        h /= 6
    }
    return {
        color: hex,
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    }
}

export function hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
