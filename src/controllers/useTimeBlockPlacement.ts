import React, { useRef, useState, useEffect } from 'react'
import { useTimeBlockContext } from '../context/TimeBlockContext'

const INTERVAL_HEIGHT = 40
const HEADER_HEIGHT = 30
const MOUSE_MOVE_THRESHOLD = 10 // Threshold of 10 pixels

export const useTimeBlockPlacement = () => {
    const { currentBlock, setCurrentBlock, setTimeBlocks } =
        useTimeBlockContext()
    const blockElementRef = useRef<HTMLElement | null>(null)
    const [timeIndicator, setTimeIndicator] = useState<string>('')
    const [pointOfOrigin, setPointOfOrigin] = useState<number | null>(null)

    const handleMouseDown = (
        dayIndex: number,
        e: React.MouseEvent<HTMLDivElement>
    ) => {
        const column = e.currentTarget as HTMLElement
        const rect = column.getBoundingClientRect()
        const startY = e.clientY - rect.top - HEADER_HEIGHT
        const startInterval = Math.floor(startY / INTERVAL_HEIGHT)

        setCurrentBlock({ dayIndex, start: startInterval, end: startInterval })
        setPointOfOrigin(startInterval) // Use the interval as the point of origin

        const currentBlockElement = document.createElement('div')
        currentBlockElement.className = 'time-block stretching'
        currentBlockElement.style.top = `${startInterval * INTERVAL_HEIGHT + HEADER_HEIGHT}px`
        currentBlockElement.style.height = '0px' // Start with zero height
        column.appendChild(currentBlockElement)

        blockElementRef.current = currentBlockElement
    }

    useEffect(() => {
        const handleMouseMove = (moveEvent: MouseEvent) => {
            if (
                !currentBlock ||
                !blockElementRef.current ||
                pointOfOrigin === null
            )
                return

            const column = document.querySelectorAll('.day-column')[
                currentBlock.dayIndex
            ] as HTMLElement
            if (!column) return

            const rect = column.getBoundingClientRect()
            const currentY = moveEvent.clientY - rect.top - HEADER_HEIGHT
            const currentInterval = Math.floor(currentY / INTERVAL_HEIGHT)

            let start = pointOfOrigin
            let end = pointOfOrigin

            const pixelDifference = currentY - pointOfOrigin * INTERVAL_HEIGHT

            if (pixelDifference >= MOUSE_MOVE_THRESHOLD) {
                end = Math.max(currentInterval + 1, pointOfOrigin + 1) // Move end downwards
            } else if (pixelDifference <= -MOUSE_MOVE_THRESHOLD) {
                start = Math.min(currentInterval, pointOfOrigin - 1) // Move start upwards
            }

            const blockElement = blockElementRef.current
            blockElement.style.top = `${Math.min(start, end) * INTERVAL_HEIGHT + HEADER_HEIGHT}px`
            blockElement.style.height = `${Math.abs(end - start) * INTERVAL_HEIGHT}px`

            const formatTime = (hour: number) => {
                const period = hour >= 12 ? 'PM' : 'AM'
                const formattedHour = hour % 12 === 0 ? 12 : hour % 12
                return `${formattedHour}:00${period}`
            }

            const timeRange = `${formatTime(Math.min(start, end))} - ${formatTime(Math.max(start, end))}`
            setTimeIndicator(timeRange)

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
            if (currentBlock) {
                const { dayIndex, start, end } = currentBlock
                const newBlock = {
                    dayIndex,
                    start: Math.min(start, end),
                    end: Math.max(start, end),
                }
                setTimeBlocks(prevBlocks => ({
                    ...prevBlocks,
                    [dayIndex]: [...(prevBlocks[dayIndex] || []), newBlock],
                }))
                if (blockElementRef.current) {
                    blockElementRef.current.classList.remove('stretching')
                    blockElementRef.current.classList.add('bouncing')
                    blockElementRef.current.addEventListener(
                        'animationend',
                        () => {
                            blockElementRef.current?.classList.remove(
                                'bouncing'
                            )
                            blockElementRef.current?.remove()
                            blockElementRef.current = null
                        },
                        { once: true }
                    )
                }
            }
            setCurrentBlock(null)
            setTimeIndicator('')
            setPointOfOrigin(null)
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [currentBlock, pointOfOrigin, setCurrentBlock, setTimeBlocks])

    return { handleMouseDown, timeIndicator }
}
