import { TimeBlock as TimeBlockType } from '../db'

export const formatTime = (interval: number): string => {
    const totalMinutes = interval * 15
    const hour = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    const period = hour >= 12 ? 'PM' : 'AM'
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12
    return `${formattedHour}:${minutes < 10 ? '0' : ''}${minutes}${period}`
}

export const getTimeBlockStyle = (
    block: TimeBlockType,
    intervalHeight: number,
    headerHeight: number
) => ({
    top: block.start * (intervalHeight / 4) + headerHeight,
    height: (block.end - block.start) * (intervalHeight / 4),
})

export const shouldRenderBlock = (
    block: TimeBlockType,
    activeBlockId: string | null,
    isResizing: boolean
): boolean => block.id !== activeBlockId || !isResizing

export const isButtonOrChild = (element: HTMLElement | null): boolean => {
    while (element) {
        if (element.tagName.toLowerCase() === 'button') {
            return true
        }
        element = element.parentElement
    }
    return false
}

export const isDeleteButtonOrChild = (element: HTMLElement | null): boolean => {
    while (element) {
        if (
            element.tagName.toLowerCase() === 'button' &&
            element.classList.contains('bin-icon')
        ) {
            return true
        }
        element = element.parentElement
    }
    return false
}
