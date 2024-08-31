import React, { useState, useEffect, useRef } from 'react'
import { useTimeBlockContext } from '../context/TimeBlockContext'
import { v4 as uuidv4 } from 'uuid'
import type { TimeBlock } from '../db'
import { formatTime, isDeleteButtonOrChild } from '../utils/timeBlockUtils'

// Constants for layout
const INTERVAL_HEIGHT = 40
const HEADER_HEIGHT = 30
const MOUSE_MOVE_THRESHOLD = INTERVAL_HEIGHT / 4 / 4
const MIN_BLOCK_HEIGHT = INTERVAL_HEIGHT / 4

// Resize state type
interface ResizeState {
    active: boolean
    edge: 'top' | 'bottom' | null
    initialY: number
    initialHeight: number
    initialTop: number
}

export const useTimeBlockPlacement = () => {
    const {
        currentBlock,
        setCurrentBlock,
        setTimeBlocks,
        setRecentBlockId,
        schedules,
        selectedSchedule,
        timeBlocks,
    } = useTimeBlockContext()

    const [timeIndicator, setTimeIndicator] = useState<string>('')
    const [pointOfOrigin, setPointOfOrigin] = useState<number | null>(null)
    const [blockProps, setBlockProps] = useState<{
        top: number
        height: number
        timeRange: string
        direction: 'up' | 'down' | null
    } | null>(null)
    const [activeBlockId, setActiveBlockId] = useState<string | null>(null) // Tracks the active block

    const isDraggingRef = useRef<boolean>(false)
    const currentDayIndexRef = useRef<number | null>(null)
    const processedDayIndices = useRef<Set<number>>(new Set())
    const resizeStateRef = useRef<ResizeState>({
        active: false,
        edge: null,
        initialY: 0,
        initialHeight: 0,
        initialTop: 0,
    })

    useEffect(() => {
        const dayColumns = Array.from(document.querySelectorAll('.day-column'))
        const handleMouseEnter = (index: number) => {
            currentDayIndexRef.current = index
        }
        const handleMouseLeave = () => {
            currentDayIndexRef.current = null
        }
        dayColumns.forEach((column, index) => {
            column.addEventListener('mouseenter', () => handleMouseEnter(index))
            column.addEventListener('mouseleave', handleMouseLeave)
        })
        return () => {
            dayColumns.forEach(column => {
                column.removeEventListener('mouseenter', () => handleMouseEnter)
                column.removeEventListener('mouseleave', handleMouseLeave)
            })
        }
    }, [])

    const handleMouseDown = (
        dayIndex: number,
        e: React.MouseEvent<HTMLDivElement>,
        blockId?: string,
        edge?: 'top' | 'bottom'
    ) => {
        e.preventDefault()

        // If a blockId is present, the user clicked on a block somewhere
        // In order to manipulate the block, it has be to in the selectedSchedule
        const activeBlock =
            selectedSchedule && blockId
                ? timeBlocks[selectedSchedule]?.find(
                      (block: TimeBlock) => block.id === blockId
                  )
                : null

        if (!activeBlock && blockId) return

        if (activeBlock) {
            setActiveBlockId(activeBlock.id)
            setCurrentBlock({
                id: 'preview',
                dayIndex: activeBlock.dayIndex,
                start: activeBlock.start,
                end: activeBlock.end,
                color: activeBlock.color,
                scheduleId: activeBlock.scheduleId,
            })
            if (edge) {
                resizeStateRef.current = {
                    active: true,
                    edge: edge, // Set edge from parameter
                    initialY: e.clientY,
                    initialHeight: activeBlock.end - activeBlock.start,
                    initialTop: activeBlock.start,
                }
            }
        }

        // Block duplication
        if (e.metaKey && selectedSchedule && !edge) {
            // CMD + Click on a block and drag the mouse across to duplicate the block to adjacent days
            if (activeBlock) {
                isDraggingRef.current = true
                processedDayIndices.current.clear()

                const timeBlockElements =
                    document.querySelectorAll('.time-block')
                timeBlockElements.forEach(element => {
                    element.classList.add('dragging')
                })

                const handleDragMouseMove = () => {
                    console.log('here')
                    if (!isDraggingRef.current) return

                    const targetDayIndex = currentDayIndexRef.current

                    if (
                        targetDayIndex !== null &&
                        targetDayIndex !== activeBlock.dayIndex &&
                        !processedDayIndices.current.has(targetDayIndex)
                    ) {
                        const newBlock: TimeBlock = {
                            ...activeBlock,
                            id: uuidv4(),
                            dayIndex: targetDayIndex,
                        }

                        setTimeBlocks(prevBlocks => ({
                            ...prevBlocks,
                            [selectedSchedule]: [
                                ...(prevBlocks[selectedSchedule] || []),
                                newBlock,
                            ],
                        }))

                        setRecentBlockId(newBlock.id)
                        processedDayIndices.current.add(targetDayIndex)
                    }
                }

                const handleDragMouseUp = () => {
                    isDraggingRef.current = false
                    processedDayIndices.current.clear()
                    document.removeEventListener(
                        'mousemove',
                        handleDragMouseMove
                    )
                    document.removeEventListener('mouseup', handleDragMouseUp)
                }

                document.addEventListener('mousemove', handleDragMouseMove)
                document.addEventListener('mouseup', handleDragMouseUp)
            }
        } else {
            if (isDeleteButtonOrChild(e.target as HTMLElement)) {
                return
            }

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

            if (activeBlock) {
                const start = activeBlock.start
                const end = activeBlock.end
                setCurrentBlock({
                    id: 'preview',
                    dayIndex,
                    start,
                    end,
                    color: schedule.color,
                    scheduleId: schedule.id,
                })
                setPointOfOrigin(
                    edge === 'top' ? activeBlock.end : activeBlock.start
                )
                const timeRange = `${formatTime(Math.min(start, end))} - ${formatTime(Math.max(start, end))}`
                setTimeIndicator(timeRange)
                setBlockProps({
                    top:
                        activeBlock.start * (INTERVAL_HEIGHT / 4) +
                        HEADER_HEIGHT,
                    height:
                        (activeBlock.end - activeBlock.start) *
                        (INTERVAL_HEIGHT / 4),
                    timeRange: timeRange,
                    direction: null,
                })
            } else {
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
                    height: MIN_BLOCK_HEIGHT,
                    timeRange: timeRange,
                    direction: null,
                })
            }
        }
    }

    useEffect(() => {
        const handleMouseMove = (moveEvent: MouseEvent) => {
            const resizeState = resizeStateRef.current

            if (!currentBlock || pointOfOrigin === null) return

            const column =
                document.querySelectorAll<HTMLElement>('.day-column')[
                    currentBlock.dayIndex
                ]
            if (!column) return

            const rect = column.getBoundingClientRect()
            const currentY = moveEvent.clientY - rect.top - HEADER_HEIGHT
            const adjustedY = Math.max(0, currentY)
            const currentInterval = Math.floor(
                adjustedY / (INTERVAL_HEIGHT / 4)
            )

            let start: number
            let end: number

            let direction: 'up' | 'down' = 'down'

            const pixelDifference =
                adjustedY - pointOfOrigin * (INTERVAL_HEIGHT / 4)

            if (resizeState.active) {
                // Resizing logic
                start = currentBlock.start
                end = currentBlock.end

                if (resizeState.edge === 'bottom') {
                    if (pixelDifference >= MOUSE_MOVE_THRESHOLD) {
                        direction = 'down'
                        start = Math.min(currentInterval, pointOfOrigin)
                        end = Math.max(currentInterval + 1, pointOfOrigin)
                    } else if (pixelDifference <= -MOUSE_MOVE_THRESHOLD) {
                        direction = 'up'
                        start = Math.min(currentInterval, pointOfOrigin)
                        end = Math.max(currentInterval - 1, pointOfOrigin)
                    }
                } else if (resizeState.edge === 'top') {
                    if (pixelDifference >= MOUSE_MOVE_THRESHOLD) {
                        direction = 'down'
                        start = Math.min(currentInterval, pointOfOrigin)
                        end = Math.max(currentInterval + 1, pointOfOrigin)
                    } else if (pixelDifference <= -MOUSE_MOVE_THRESHOLD) {
                        direction = 'up'
                        start = Math.min(currentInterval, pointOfOrigin)
                        end = Math.max(currentInterval - 1, pointOfOrigin)
                    }
                }
            } else {
                // Handle new block drawing logic (unchanged from the original logic)
                start = pointOfOrigin
                end = pointOfOrigin

                if (pixelDifference >= MOUSE_MOVE_THRESHOLD) {
                    end = Math.max(currentInterval + 1, pointOfOrigin + 1)
                    direction = 'down'
                } else if (pixelDifference <= -MOUSE_MOVE_THRESHOLD) {
                    start = Math.min(currentInterval, pointOfOrigin - 1)
                    direction = 'up'
                }
            }
            const timeRange = `${formatTime(Math.min(start, end))} - ${formatTime(Math.max(start, end))}`
            setTimeIndicator(timeRange)
            setBlockProps({
                top:
                    Math.min(start, end) * (INTERVAL_HEIGHT / 4) +
                    HEADER_HEIGHT,
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
            const resizeState = resizeStateRef.current
            if (resizeState.active) {
                console.log('Resizing finished')
                resizeStateRef.current = {
                    active: false,
                    edge: null,
                    initialY: 0,
                    initialHeight: 0,
                    initialTop: 0,
                }
                setActiveBlockId(null) // Clear active block id
            }

            if (isDraggingRef.current) {
                const timeBlockElements =
                    document.querySelectorAll('.time-block')
                timeBlockElements.forEach(element => {
                    element.classList.remove('dragging')
                })
                isDraggingRef.current = false
            }

            if (!currentBlock || pointOfOrigin === null || !selectedSchedule)
                return

            const { start, end, color, scheduleId, dayIndex } = currentBlock

            if (activeBlockId) {
                // Resizing an existing block
                setTimeBlocks(prevBlocks => {
                    const updatedBlocks = (
                        prevBlocks[selectedSchedule] || []
                    ).map(block =>
                        block.id === activeBlockId
                            ? { ...block, start, end }
                            : block
                    )
                    return {
                        ...prevBlocks,
                        [selectedSchedule]: updatedBlocks,
                    }
                })
            } else {
                // Creating a new block
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
            }

            // Clear states
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
        selectedSchedule,
    ])

    return {
        handleMouseDown,
        blockProps,
        activeBlockId, // Return activeBlockId
        timeIndicator,
    }
}
