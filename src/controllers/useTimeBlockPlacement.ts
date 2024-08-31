import React, { useState, useEffect, useRef } from 'react'
import { useTimeBlockContext } from '../context/TimeBlockContext'
import { v4 as uuidv4 } from 'uuid'
import type { TimeBlock } from '../db'
import {
    calculateTimeRange,
    isDeleteButtonOrChild,
} from '../utils/timeBlockUtils'
import { MOUSE_MOVE_THRESHOLD } from '../constants/constants'
import {
    calculateCurrentInterval,
    calculatePixelDifference,
} from '../utils/mouseUtils'
import { manageEventListener } from '../utils/eventUtils'
import { calculateBlockProps } from '../utils/blockUtils'

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
    const [activeBlockId, setActiveBlockId] = useState<string | null>(null)

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

    const resetStates = () => {
        setCurrentBlock(null)
        setTimeIndicator('')
        setPointOfOrigin(null)
        setBlockProps(null)
    }

    useEffect(() => {
        const dayColumns = Array.from(document.querySelectorAll('.day-column'))
        const handleMouseEnter = (event: Event) => {
            const target = event.currentTarget as HTMLElement
            const index = Array.from(
                document.querySelectorAll('.day-column')
            ).indexOf(target)
            currentDayIndexRef.current = index
            console.log('Current day index: ', currentDayIndexRef.current)
        }
        const handleMouseLeave = () => {
            currentDayIndexRef.current = null
            console.log('Leaving day column')
        }
        dayColumns.forEach(column => {
            column.addEventListener(
                'mouseenter',
                handleMouseEnter as EventListener
            )
            column.addEventListener(
                'mouseleave',
                handleMouseLeave as EventListener
            )
        })
        return () => {
            dayColumns.forEach(column => {
                column.removeEventListener(
                    'mouseenter',
                    handleMouseEnter as EventListener
                )
                column.removeEventListener(
                    'mouseleave',
                    handleMouseLeave as EventListener
                )
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
                    edge,
                    initialY: e.clientY,
                    initialHeight: activeBlock.end - activeBlock.start,
                    initialTop: activeBlock.start,
                }
            }
        }

        if (e.metaKey && selectedSchedule && !edge) {
            if (activeBlock) {
                isDraggingRef.current = true
                processedDayIndices.current.clear()

                const handleDragMouseMove = () => {
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
                    manageEventListener(
                        'mousemove',
                        handleDragMouseMove as EventListener,
                        'remove'
                    )
                    manageEventListener(
                        'mouseup',
                        handleDragMouseUp as EventListener,
                        'remove'
                    )
                }

                manageEventListener(
                    'mousemove',
                    handleDragMouseMove as EventListener,
                    'add'
                )
                manageEventListener(
                    'mouseup',
                    handleDragMouseUp as EventListener,
                    'add'
                )
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
            const startInterval = calculateCurrentInterval(e.clientY, rect)

            if (!schedule) return

            let start, end
            if (activeBlock) {
                start = activeBlock.start
                end = activeBlock.end
                setPointOfOrigin(
                    edge === 'top' ? activeBlock.end : activeBlock.start
                )
            } else {
                start = startInterval
                end = startInterval + 1
                setPointOfOrigin(startInterval)
            }
            const timeRange = calculateTimeRange(start, end)
            setTimeIndicator(timeRange)
            setBlockProps({
                ...calculateBlockProps(start, end),
                timeRange,
                direction: null,
            })
            setCurrentBlock({
                id: 'preview',
                dayIndex,
                start,
                end,
                color: schedule.color,
                scheduleId: schedule.id,
            })
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
            const currentInterval = calculateCurrentInterval(
                moveEvent.clientY,
                rect
            )
            let start: number
            let end: number
            let direction: 'up' | 'down' = 'down'
            const pixelDifference = calculatePixelDifference(
                moveEvent.clientY,
                rect,
                pointOfOrigin
            )
            console.log('Pixel difference: ', pixelDifference)
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
                // Handle new block drawing logic
                start = pointOfOrigin
                end = pointOfOrigin + 1

                if (pixelDifference >= MOUSE_MOVE_THRESHOLD) {
                    start = Math.min(currentInterval, pointOfOrigin)
                    end = Math.max(currentInterval + 1, pointOfOrigin)
                    direction = 'down'
                } else if (pixelDifference <= -MOUSE_MOVE_THRESHOLD) {
                    start = Math.min(currentInterval, pointOfOrigin - 1)
                    end = Math.max(currentInterval, pointOfOrigin)
                    direction = 'up'
                }
            }
            const timeRange = calculateTimeRange(start, end)
            setTimeIndicator(timeRange)
            setBlockProps({
                ...calculateBlockProps(start, end),
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
            resetStates()
            manageEventListener(
                'mousemove',
                handleMouseMove as EventListener,
                'remove'
            )
            manageEventListener(
                'mouseup',
                handleMouseUp as EventListener,
                'remove'
            )
        }

        manageEventListener(
            'mousemove',
            handleMouseMove as EventListener,
            'add'
        )
        manageEventListener('mouseup', handleMouseUp as EventListener, 'add')

        return () => {
            manageEventListener(
                'mousemove',
                handleMouseMove as EventListener,
                'remove'
            )
            manageEventListener(
                'mouseup',
                handleMouseUp as EventListener,
                'remove'
            )
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
        activeBlockId,
        timeIndicator,
    }
}
