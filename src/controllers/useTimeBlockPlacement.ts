import React, { useState, useEffect, useRef } from 'react'
import { useTimeBlockContext } from '../context/TimeBlockContext'
import { v4 as uuidv4 } from 'uuid'
import type { TimeBlock } from '../db'
import { calculateTimeRange } from '../utils/timeBlockUtils'
import { MOUSE_MOVE_THRESHOLD } from '../constants/constants'
import {
    calculateCurrentInterval,
    calculatePixelDifference,
} from '../utils/mouseUtils'
import { manageEventListener } from '../utils/eventUtils'
import { calculateBlockProps } from '../utils/blockUtils'

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
    const [timeBlockPreviewProps, setTimeBlockPreviewProps] = useState<{
        top: number
        height: number
        timeRange: string
        direction: 'up' | 'down' | null
    } | null>(null)

    const isCreating = useRef<boolean>(false)
    const isDuplicating = useRef<boolean>(false)
    const isRepositioning = useRef<boolean>(false)
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
        console.log('Resetting states')
        setCurrentBlock(null)
        setTimeIndicator('')
        setPointOfOrigin(null)
        setTimeBlockPreviewProps(null)
        isCreating.current = false
        isDuplicating.current = false
        processedDayIndices.current.clear()
        isRepositioning.current = false
        resizeStateRef.current = {
            active: false,
            edge: null,
            initialY: 0,
            initialHeight: 0,
            initialTop: 0,
        }
    }

    useEffect(() => {
        const dayColumns = Array.from(document.querySelectorAll('.day-column'))
        const handleMouseEnter = (event: Event) => {
            const target = event.currentTarget as HTMLElement
            const index = Array.from(
                document.querySelectorAll('.day-column')
            ).indexOf(target)
            currentDayIndexRef.current = index
        }
        const handleMouseLeave = () => {
            currentDayIndexRef.current = null
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

        console.log(`handleMouseDown args:
            Day Index: ${dayIndex}
            Event: ${e}
            Block ID: ${blockId}
            Edge: ${edge}`)

        const schedule = schedules.find(
            schedule => schedule.id === selectedSchedule
        )

        if (!schedule) return

        // No blockId? New block.
        if (!blockId) {
            isCreating.current = true
            const column = e.currentTarget as HTMLElement
            const rect = column.getBoundingClientRect()
            const startInterval = calculateCurrentInterval(e.clientY, rect)

            const start = startInterval
            const end = startInterval + 1

            setPointOfOrigin(startInterval)

            const timeRange = calculateTimeRange(start, end)

            setTimeIndicator(timeRange)

            setTimeBlockPreviewProps({
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
            return
        }

        // Find the active block
        const activeBlock =
            selectedSchedule && blockId
                ? timeBlocks[selectedSchedule]?.find(
                      (block: TimeBlock) => block.id === blockId
                  )
                : null

        if (!activeBlock) {
            // Log Error message for schedule and blockid
            console.error(
                `No active block found for schedule: ${selectedSchedule} and blockId: ${blockId}`
            )
            return
        }

        // blockId and edge? Resizing.
        if (blockId && edge) {
            const start = activeBlock.start
            const end = activeBlock.end

            setPointOfOrigin(
                edge === 'top' ? activeBlock.end : activeBlock.start
            )
            console.log('Setting point of origin:', pointOfOrigin)

            resizeStateRef.current = {
                active: true,
                edge,
                initialY: e.clientY,
                initialHeight: activeBlock.end - activeBlock.start,
                initialTop: activeBlock.start,
            }

            const timeRange = calculateTimeRange(start, end)

            setTimeIndicator(timeRange)

            setTimeBlockPreviewProps({
                ...calculateBlockProps(start, end),
                timeRange,
                direction: null,
            })

            setCurrentBlock(activeBlock)
            return
        }

        // blockId and no edge?
        // CMD + SHIFT? Repositioning.
        // CMD? Duplicating.

        if (blockId && !edge && ((e.metaKey && e.shiftKey) || e.metaKey)) {
            if (e.metaKey && e.shiftKey) {
                console.log('Repositioning block:', activeBlock)
                isRepositioning.current = true
                const start = activeBlock.start
                const end = activeBlock.end

                const timeRange = calculateTimeRange(start, end)

                setTimeIndicator(timeRange)

                setTimeBlockPreviewProps({
                    ...calculateBlockProps(start, end),
                    timeRange,
                    direction: null,
                })
            }
            if (e.metaKey && !e.shiftKey) {
                console.log('Duplicating block:', activeBlock)
                isDuplicating.current = true
                const timeBlockElements =
                    document.querySelectorAll('.time-block')
                timeBlockElements.forEach(element => {
                    element.classList.add('dragging')
                })
            }
            const column =
                document.querySelectorAll<HTMLElement>('.day-column')[dayIndex]
            const rect = column.getBoundingClientRect()

            const nearestInterval = calculateCurrentInterval(e.clientY, rect)
            setPointOfOrigin(nearestInterval)
            setCurrentBlock(activeBlock)
            return
        }
    }

    useEffect(() => {
        const handleMouseMove = (moveEvent: MouseEvent) => {
            if (!currentBlock || pointOfOrigin === null || !selectedSchedule)
                return
            console.log('Point of origin:', pointOfOrigin)
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

            if (isCreating.current) {
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
                    direction = 'up'
                    start = Math.min(currentInterval, pointOfOrigin)
                    end = Math.max(currentInterval - 1, pointOfOrigin)
                    direction = 'up'
                    start = Math.min(currentInterval, pointOfOrigin)
                    end = Math.max(currentInterval - 1, pointOfOrigin)
                }
                const timeRange = calculateTimeRange(start, end)
                setTimeIndicator(timeRange)
                setTimeBlockPreviewProps({
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

            if (resizeStateRef.current.active) {
                start = currentBlock.start
                end = currentBlock.end
                if (resizeStateRef.current.edge === 'bottom') {
                    if (pixelDifference >= MOUSE_MOVE_THRESHOLD) {
                        direction = 'down'
                        start = Math.min(currentInterval, pointOfOrigin)
                        end = Math.max(currentInterval + 1, pointOfOrigin)
                    } else if (pixelDifference <= -MOUSE_MOVE_THRESHOLD) {
                        direction = 'up'
                        start = Math.min(currentInterval, pointOfOrigin)
                        end = Math.max(currentInterval - 1, pointOfOrigin)
                    }
                } else if (resizeStateRef.current.edge === 'top') {
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
                const timeRange = calculateTimeRange(start, end)
                setTimeIndicator(timeRange)
                setTimeBlockPreviewProps({
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

            if (isDuplicating.current) {
                console.log('Duplicating block:', currentBlock)
                const targetDayIndex = currentDayIndexRef.current

                if (
                    targetDayIndex !== null &&
                    targetDayIndex !== currentBlock.dayIndex &&
                    !processedDayIndices.current.has(targetDayIndex)
                ) {
                    const newBlock: TimeBlock = {
                        ...currentBlock,
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

            if (isRepositioning.current) {
                const targetDayIndex = currentDayIndexRef.current
                const intervalDifference = currentInterval - pointOfOrigin

                let start = currentBlock.start
                let end = currentBlock.end

                console.log('start:', start)
                console.log('end:', end)
                console.log('pointOfOrigin:', pointOfOrigin)
                console.log('currentInterval:', currentInterval)
                console.log('difference:', intervalDifference)

                // Update the day index if moved to another column
                if (
                    targetDayIndex !== null &&
                    targetDayIndex !== currentBlock.dayIndex
                ) {
                    setCurrentBlock(prevBlock =>
                        prevBlock
                            ? {
                                  ...prevBlock,
                                  dayIndex: targetDayIndex,
                              }
                            : null
                    )
                }

                if (intervalDifference !== 0) {
                    // Calculate new start and end based on interval difference
                    start += intervalDifference
                    end += intervalDifference // Maintain the duration of the block
                    const direction = intervalDifference > 0 ? 'down' : 'up'

                    const timeRange = calculateTimeRange(start, end)
                    setTimeIndicator(timeRange)
                    setTimeBlockPreviewProps({
                        ...calculateBlockProps(start, end),
                        timeRange,
                        direction,
                    })
                    setCurrentBlock(prevBlock =>
                        prevBlock
                            ? {
                                  ...prevBlock,
                                  start,
                                  end,
                              }
                            : null
                    )

                    // Adjust pointOfOrigin to keep its relative position consistent with the block's movement
                    setPointOfOrigin(pointOfOrigin + intervalDifference)
                }
            }
        }

        const handleMouseUp = () => {
            if (!currentBlock || pointOfOrigin === null || !selectedSchedule)
                return

            const { start, end, color, scheduleId, dayIndex } = currentBlock

            if (isDuplicating.current) {
                const timeBlockElements =
                    document.querySelectorAll('.time-block')
                timeBlockElements.forEach(element => {
                    element.classList.remove('dragging')
                })
                resetStates()
            }

            if (isRepositioning.current) {
                setTimeBlocks(prevBlocks => {
                    const updatedBlocks = (
                        prevBlocks[selectedSchedule] || []
                    ).map(block =>
                        block.id === currentBlock.id
                            ? {
                                  ...block,
                                  start,
                                  end,
                                  dayIndex: currentBlock.dayIndex, // Ensure dayIndex is updated
                              }
                            : block
                    )
                    return {
                        ...prevBlocks,
                        [selectedSchedule]: updatedBlocks,
                    }
                })
                resetStates()
                return
            }

            if (isCreating.current) {
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
                resetStates()
                return
            }

            if (resizeStateRef.current.active) {
                setTimeBlocks(prevBlocks => {
                    const updatedBlocks = (
                        prevBlocks[selectedSchedule] || []
                    ).map(block =>
                        block.id === currentBlock.id
                            ? { ...block, start, end }
                            : block
                    )
                    return {
                        ...prevBlocks,
                        [selectedSchedule]: updatedBlocks,
                    }
                })
                resetStates()
                return
            }
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
    }, [currentBlock, pointOfOrigin, selectedSchedule, timeBlocks])

    return {
        handleMouseDown,
        timeBlockPreviewProps,
        timeIndicator,
    }
}
