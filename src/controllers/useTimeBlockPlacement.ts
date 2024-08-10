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
        // Function to check if the event target or any of its parents is a button
        const isButtonOrChildOfButton = (
            element: HTMLElement | null
        ): boolean => {
            while (element) {
                if (element.tagName.toLowerCase() === 'button') {
                    return true // Found a button in the ancestry
                }
                element = element.parentElement
            }
            return false
        }

        // Exit early if the original event target or any of its parents is a button
        if (isButtonOrChildOfButton(e.target as HTMLElement)) {
            return
        }

        const column = e.currentTarget as HTMLElement
        const rect = column.getBoundingClientRect()
        const startY = e.clientY - rect.top - HEADER_HEIGHT
        const startInterval = Math.floor(startY / INTERVAL_HEIGHT)

        setCurrentBlock({ dayIndex, start: startInterval, end: startInterval })
        setPointOfOrigin(startInterval)

        const currentBlockElement = document.createElement('div')
        currentBlockElement.className = 'time-block stretching'
        currentBlockElement.style.top = `${startInterval * INTERVAL_HEIGHT + HEADER_HEIGHT}px`
        currentBlockElement.style.height = '0px'
        column.appendChild(currentBlockElement)

        const timeIndicatorElement = document.createElement('div')
        timeIndicatorElement.className = 'time-indicator'
        currentBlockElement.appendChild(timeIndicatorElement)

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

            let direction: 'up' | 'down' = 'down'
            if (pixelDifference >= MOUSE_MOVE_THRESHOLD) {
                end = Math.max(currentInterval + 1, pointOfOrigin + 1)
                direction = 'down'
            } else if (pixelDifference <= -MOUSE_MOVE_THRESHOLD) {
                start = Math.min(currentInterval, pointOfOrigin - 1)
                direction = 'up'
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

            const timeIndicatorElement = blockElement.querySelector(
                '.time-indicator'
            ) as HTMLElement
            if (timeIndicatorElement) {
                timeIndicatorElement.textContent = timeRange
                timeIndicatorElement.style.position = 'absolute'
                timeIndicatorElement.style.left = '50%'
                timeIndicatorElement.style.transform = 'translateX(-50%)'
                if (direction !== 'down') {
                    timeIndicatorElement.style.top = '0'
                    timeIndicatorElement.style.bottom = 'unset'
                } else {
                    timeIndicatorElement.style.bottom = '0'
                    timeIndicatorElement.style.top = 'unset'
                }
            }

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
            if (
                !currentBlock ||
                !blockElementRef.current ||
                pointOfOrigin === null
            )
                return

            const { start, end } = currentBlock

            console.log('Mouse Up Event Detected')
            console.log('Current Block:', currentBlock)
            console.log('Start Interval:', start)
            console.log('End Interval:', end)

            const newBlock = {
                dayIndex: currentBlock.dayIndex,
                start,
                end: start === end ? end + 1 : end,
            }

            console.log('New Block to be Added:', newBlock)

            setTimeBlocks(prevBlocks => {
                const updatedBlocks = {
                    ...prevBlocks,
                    [currentBlock.dayIndex]: [
                        ...(prevBlocks[currentBlock.dayIndex] || []),
                        newBlock,
                    ],
                }
                console.log('Updated Time Blocks:', updatedBlocks)
                return updatedBlocks
            })

            if (blockElementRef.current) {
                console.log('Removing and Cleaning Up Block Element')
                blockElementRef.current.classList.remove('stretching')
                blockElementRef.current.classList.add('bouncing')
                blockElementRef.current.addEventListener(
                    'animationend',
                    () => {
                        blockElementRef.current?.classList.remove('bouncing')
                        blockElementRef.current?.remove()
                        blockElementRef.current = null
                        console.log('Block Element Removed')
                    },
                    { once: true }
                )
            }

            setCurrentBlock(null)
            setTimeIndicator('')
            setPointOfOrigin(null)
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)

            console.log('Event Listeners Removed. State Reset.')
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
