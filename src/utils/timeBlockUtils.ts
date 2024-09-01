import { TimeBlock as TimeBlockType } from '../db'

export const formatTime = (interval: number): string => {
    const totalMinutes = interval * 15
    const hour = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    const period = hour >= 12 ? 'PM' : 'AM'
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12
    return `${formattedHour}:${minutes < 10 ? '0' : ''}${minutes}${period}`
}

export const calculateTimeRange = (start: number, end: number) => {
    return `${formatTime(Math.min(start, end))} - ${formatTime(
        Math.max(start, end)
    )}`
}

export const shouldRenderBlock = (
    block: TimeBlockType,
    activeBlockId: string | undefined,
    isResizing: boolean,
    isRepositioning: boolean
): boolean => !(block.id === activeBlockId && (isResizing || isRepositioning))

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
