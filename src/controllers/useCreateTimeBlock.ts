import { useEffect, useState } from 'react'
import { useTimeBlockContext } from '../context/TimeBlockContext'
import { v4 as uuidv4 } from 'uuid'
import type { TimeBlock } from '../db'
import { formatTime } from '../utils/timeBlockUtils'

// Constants for layout
const INTERVAL_HEIGHT = 40
const HEADER_HEIGHT = 30
const MOUSE_MOVE_THRESHOLD = INTERVAL_HEIGHT / 4 / 4

export const useCreateTimeBlock = () => {
    const {
        setCurrentBlock,
        setTimeBlocks,
        setRecentBlockId,
        schedules,
        selectedSchedule,
    } = useTimeBlockContext()

    const [timeIndicator, setTimeIndicator] = useState<string>('')
    const [pointOfOrigin, setPointOfOrigin] = useState<number | null>(null)
    const [blockProps, setBlockProps] = useState<{
        top: number
        height: number
        timeRange: string
        direction: 'up' | 'down' | null
    } | null>(null)

    const handleMouseDown = (
        dayIndex: number,
        e: React.MouseEvent<HTMLDivElement>
    ) => {
        e.preventDefault()

        if (!selectedSchedule) {
            alert('Please select a schedule before adding time blocks.')
            return
        }

        const schedule = schedules.find(
            schedule => schedule.id === selectedSchedule
        )

        const column = e.currentTarget as HTMLElement
        const rect = column.getBoundingClientRect()
        const startY = e.clientY - rect.top - HEADER_HEIGHT
        const startInterval = Math.round(startY / (INTERVAL_HEIGHT / 4))

        if (!schedule) return

        const start = startInterval
        const end = startInterval + 1
        setCurrentBlock({
            id: 'preview',
            dayIndex,
            start,
            end,
            color: schedule.color,
            scheduleId: schedule.id,
        })
        setPointOfOrigin(startInterval)
        const timeRange = `${formatTime(Math.min(start, end))} - ${formatTime(Math.max(start, end))}`
        setTimeIndicator(timeRange)
        setBlockProps({
            top: startInterval * (INTERVAL_HEIGHT / 4) + HEADER_HEIGHT,
            height: INTERVAL_HEIGHT / 4,
            timeRange: timeRange,
            direction: null,
        })

        // Add mouse event listeners for drag and release
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
    }

    const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!pointOfOrigin || !selectedSchedule || !currentBlock) return

        const column =
            document.querySelectorAll<HTMLElement>('.day-column')[
                currentBlock.dayIndex
            ]
        if (!column) return

        const rect = column.getBoundingClientRect()
        const currentY = moveEvent.clientY - rect.top - HEADER_HEIGHT
        const adjustedY = Math.max(0, currentY)
        const currentInterval = Math.floor(adjustedY / (INTERVAL_HEIGHT / 4))

        let start: number = pointOfOrigin
        let end: number = pointOfOrigin
        let direction: 'up' | 'down' = 'down'

        const pixelDifference =
            adjustedY - pointOfOrigin * (INTERVAL_HEIGHT / 4)

        if (pixelDifference >= MOUSE_MOVE_THRESHOLD) {
            end = Math.max(currentInterval + 1, pointOfOrigin + 1)
            direction = 'down'
        } else if (pixelDifference <= -MOUSE_MOVE_THRESHOLD) {
            start = Math.min(currentInterval, pointOfOrigin - 1)
            direction = 'up'
        }

        const timeRange = `${formatTime(Math.min(start, end))} - ${formatTime(Math.max(start, end))}`
        setTimeIndicator(timeRange)
        setBlockProps({
            top: Math.min(start, end) * (INTERVAL_HEIGHT / 4) + HEADER_HEIGHT,
            height: Math.abs(end - start) * (INTERVAL_HEIGHT / 4),
            timeRange,
            direction,
        })

        setCurrentBlock(prevBlock =>
            prevBlock
                ? {
                      ...prevBlock,
                      start: Math.min(start, end),
                      end: Math.max(start, end),
                  }
                : null
        )
    }

    const handleMouseUp = () => {
        if (!currentBlock || pointOfOrigin === null || !selectedSchedule) return

        const { start, end, color, scheduleId, dayIndex } = currentBlock

        const newBlock: TimeBlock = {
            id: uuidv4(),
            dayIndex,
            start,
            end: start === end ? end + 1 : end,
            color,
            scheduleId,
        }

        setTimeBlocks(prevBlocks => ({
            ...prevBlocks,
            [selectedSchedule]: [
                ...(prevBlocks[selectedSchedule] || []),
                newBlock,
            ],
        }))

        setRecentBlockId(newBlock.id)

        // Clear states
        setCurrentBlock(null)
        setTimeIndicator('')
        setPointOfOrigin(null)
        setBlockProps(null)

        // Remove mouse event listeners
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
    }

    return {
        handleMouseDown,
        blockProps,
        timeIndicator,
    }
}
