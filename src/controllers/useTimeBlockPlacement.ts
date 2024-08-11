import React, { useState, useEffect } from 'react'
import { useTimeBlockContext } from '../context/TimeBlockContext'
import { v4 as uuidv4 } from 'uuid'
import type { TimeBlock } from '../context/TimeBlockContext'

const INTERVAL_HEIGHT = 40 // 40 pixels remain
const HEADER_HEIGHT = 30
const MOUSE_MOVE_THRESHOLD = INTERVAL_HEIGHT / 4 / 4 // Updated threshold

export const useTimeBlockPlacement = () => {
    const { currentBlock, setCurrentBlock, setTimeBlocks, setRecentBlockId } =
        useTimeBlockContext()
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
        console.log(`handleMouseDown triggered on dayIndex: ${dayIndex}`)

        const isButtonOrChildOfButton = (
            element: HTMLElement | null
        ): boolean => {
            while (element) {
                if (element.tagName.toLowerCase() === 'button') {
                    return true
                }
                element = element.parentElement
            }
            return false
        }

        if (isButtonOrChildOfButton(e.target as HTMLElement)) {
            return
        }

        const column = e.currentTarget as HTMLElement
        const rect = column.getBoundingClientRect()
        const startY = e.clientY - rect.top - HEADER_HEIGHT
        const startInterval = Math.round(startY / (INTERVAL_HEIGHT / 4))

        setCurrentBlock({
            id: 'preview',
            dayIndex,
            start: startInterval,
            end: startInterval,
        })
        setPointOfOrigin(startInterval)
        setBlockProps({
            top: startInterval * (INTERVAL_HEIGHT / 4) + HEADER_HEIGHT,
            height: 0,
            timeRange: '',
            direction: null,
        })
    }

    useEffect(() => {
        const handleMouseMove = (moveEvent: MouseEvent) => {
            if (!currentBlock || pointOfOrigin === null) return

            const column = document.querySelectorAll('.day-column')[
                currentBlock.dayIndex
            ] as HTMLElement
            if (!column) return

            const rect = column.getBoundingClientRect()
            const currentY = moveEvent.clientY - rect.top - HEADER_HEIGHT
            const adjustedY = Math.max(0, currentY)
            const currentInterval = Math.floor(
                adjustedY / (INTERVAL_HEIGHT / 4)
            )

            let start = pointOfOrigin
            let end = pointOfOrigin

            const pixelDifference =
                adjustedY - pointOfOrigin * (INTERVAL_HEIGHT / 4)

            let direction: 'up' | 'down' = 'down'
            if (pixelDifference >= MOUSE_MOVE_THRESHOLD) {
                end = Math.max(currentInterval + 1, pointOfOrigin + 1)
                direction = 'down'
            } else if (pixelDifference <= -MOUSE_MOVE_THRESHOLD) {
                start = Math.min(currentInterval, pointOfOrigin - 1)
                direction = 'up'
            }
            const formatTime = (interval: number) => {
                const totalMinutes = interval * 15
                const hour = Math.floor(totalMinutes / 60)
                const minutes = totalMinutes % 60
                const period = hour >= 12 ? 'PM' : 'AM'
                const formattedHour = hour % 12 === 0 ? 12 : hour % 12
                return `${formattedHour}:${minutes < 10 ? '0' : ''}${minutes}${period}`
            }

            const timeRange = `${formatTime(Math.min(start, end))} - ${formatTime(Math.max(start, end))}`
            setTimeIndicator(timeRange)
            setBlockProps({
                top:
                    Math.min(start, end) * (INTERVAL_HEIGHT / 4) +
                    HEADER_HEIGHT,
                height: Math.abs(end - start) * (INTERVAL_HEIGHT / 4),
                timeRange,
                direction, // Include direction in blockProps
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
            if (!currentBlock || pointOfOrigin === null) return

            const { start, end } = currentBlock

            const newBlock: TimeBlock = {
                id: uuidv4(), // Generate a unique ID for each block
                dayIndex: currentBlock.dayIndex,
                start,
                end: start === end ? end + 1 : end,
            }

            console.log('Creating new block:', newBlock)

            setTimeBlocks(prevBlocks => {
                const updatedBlocks = {
                    ...prevBlocks,
                    [currentBlock.dayIndex]: [
                        ...(prevBlocks[currentBlock.dayIndex] || []),
                        newBlock,
                    ],
                }
                return updatedBlocks
            })

            setRecentBlockId(newBlock.id) // Set recent block ID

            setCurrentBlock(null)
            setTimeIndicator('')
            setPointOfOrigin(null)
            setBlockProps(null)
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [
        currentBlock,
        pointOfOrigin,
        setCurrentBlock,
        setTimeBlocks,
        setRecentBlockId,
    ])

    return { handleMouseDown, blockProps, timeIndicator }
}
