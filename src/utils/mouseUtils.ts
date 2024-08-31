import { HEADER_HEIGHT, INTERVAL_HEIGHT } from '../constants/constants'

export const calculateCurrentInterval = (
    mouseY: number,
    columnRect: DOMRect
): number => {
    const currentY = mouseY - columnRect.top - HEADER_HEIGHT
    const adjustedY = Math.max(0, currentY)
    const currentInterval = Math.floor(adjustedY / (INTERVAL_HEIGHT / 4))
    return currentInterval
}

export const calculatePixelDifference = (
    mouseY: number,
    columnRect: DOMRect,
    pointOfOrigin: number
): number => {
    const currentY = mouseY - columnRect.top - HEADER_HEIGHT
    const adjustedY = Math.max(0, currentY)
    return adjustedY - pointOfOrigin * (INTERVAL_HEIGHT / 4)
}
