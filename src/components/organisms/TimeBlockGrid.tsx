import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useTimeBlockContext } from '../../context/TimeBlockContext'
import { TimeBlock } from '../molecules/TimeBlock'
import { IntervalLine } from '../atoms/IntervalLine'
import { useTimeBlockPlacement } from '../../controllers/useTimeBlockPlacement'
import { TimeBlockPreview } from '../molecules/TimeBlockPreview'
import { Schedule, type TimeBlock as TimeBlockType } from '../../db'
import { formatTime, shouldRenderBlock } from '../../utils/timeBlockUtils'
import { calculateBlockProps } from '../../utils/blockUtils'
import { HoverLine } from '../atoms/HoverLine'
import { calculateCurrentInterval } from '../../utils/mouseUtils'
import {
    HEADER_HEIGHT,
    INTERVAL_HEIGHT,
    RESIZE_THRESHOLD,
} from '../../constants/constants'

const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
]

export const TimeBlockGrid: React.FC = () => {
    const {
        currentBlock,
        timeBlocks,
        recentBlockId,
        selectedSchedule,
        schedules,
        isHoverLineVisible,
    } = useTimeBlockContext()

    const { handleMouseDown, timeBlockPreviewProps } = useTimeBlockPlacement()
    const [bouncingBlockId, setBouncingBlockId] = useState<string | null>(null)
    const [hoverPosition, setHoverPosition] = useState<number | null>(null)
    const [isHoveringOverBlock, setIsHoveringOverBlock] = useState(false)

    const gridRef = useRef<HTMLDivElement>(null)
    const isDrawingRef = useRef<boolean>(false)
    const isResizingRef = useRef<boolean>(false)
    const isRepositioningRef = useRef<boolean>(false)

    useEffect(() => {
        if (recentBlockId) {
            setBouncingBlockId(recentBlockId)
            const timer = setTimeout(() => {
                setBouncingBlockId(null)
            }, 800)

            return () => clearTimeout(timer)
        }
    }, [recentBlockId])

    const handleMouseMove = useCallback(
        (event: React.MouseEvent) => {
            if (isHoveringOverBlock) {
                setHoverPosition(null)
                return
            }

            const gridColumn = event.currentTarget as HTMLElement
            const columnRect = gridColumn.getBoundingClientRect()
            const currentInterval = calculateCurrentInterval(
                event.clientY,
                columnRect
            )
            setHoverPosition(
                (currentInterval - 1) * (INTERVAL_HEIGHT / 4) + HEADER_HEIGHT
            ) // Convert interval back to pixel position
        },
        [isHoveringOverBlock]
    )

    const handleMouseEnterBlock = () => {
        setIsHoveringOverBlock(true)
    }

    const handleMouseLeaveBlock = () => {
        setIsHoveringOverBlock(false)
    }

    const handleMouseDownOnTimeBlock = (
        dayIndex: number,
        e: React.MouseEvent<HTMLDivElement>,
        blockId: string
    ) => {
        e.stopPropagation()

        if (!(e.target as HTMLElement).classList.contains('time-block')) return

        console.log('Mouse down on block', blockId)

        isResizingRef.current = false
        isRepositioningRef.current = false
        const isCmdClick = e.metaKey
        const isShiftClick = e.shiftKey

        if (isCmdClick) {
            if (isCmdClick && isShiftClick) isRepositioningRef.current = true
            handleMouseDown(dayIndex, e, blockId)
            return
        }

        const blockElement = e.target as HTMLElement
        const blockRect = blockElement.getBoundingClientRect()
        const initialTop = blockRect.top
        const initialHeight = blockRect.height
        const mouseYRelativeToBlock = e.clientY - initialTop
        let edge: 'top' | 'bottom' | null = null

        console.log('Mouse Y relative to block', mouseYRelativeToBlock)
        if (
            mouseYRelativeToBlock <= RESIZE_THRESHOLD &&
            mouseYRelativeToBlock >= 0
        ) {
            edge = 'top'
        } else if (
            initialHeight - mouseYRelativeToBlock <= RESIZE_THRESHOLD &&
            mouseYRelativeToBlock >= 0
        ) {
            edge = 'bottom'
        }

        if (edge) {
            console.log('Resizing block', blockId)
            console.log('Edge', edge)
            isResizingRef.current = true
            handleMouseDown(dayIndex, e, blockId, edge)
            return
        }
    }

    const handleMouseDownOnDayColumn = (
        dayIndex: number,
        e: React.MouseEvent<HTMLDivElement>
    ) => {
        e.stopPropagation()

        if (!(e.target as HTMLElement).classList.contains('interval-line'))
            return

        console.log('selectedSchedule', selectedSchedule)

        if (!selectedSchedule) {
            alert('Please select a schedule before adding time blocks.')
            return
        }

        isDrawingRef.current = true
        handleMouseDown(dayIndex, e)
    }

    const getScheduleDetails = (id: string | null) => {
        return schedules.find(schedule => schedule.id === id)
    }

    const renderTimeBlocks = (
        scheduleId: string,
        opacity: number,
        dayIndex: number,
        zIndex: number
    ) => {
        const scheduleDetails: Schedule | undefined =
            getScheduleDetails(scheduleId)

        if (!scheduleDetails) {
            console.error(
                `No schedule found with id: ${scheduleId}, skipping rendering.`
            )
            return null
        }

        const scheduleColor = scheduleDetails.color
        const scheduleBgColor = scheduleDetails.bgColor

        const renderBlock = (block: TimeBlockType) => {
            const { top, height } = calculateBlockProps(block.start, block.end)
            const timeRange = `${formatTime(block.start)} - ${formatTime(block.end)}`

            return (
                <div
                    key={block.id}
                    onMouseDown={e =>
                        handleMouseDownOnTimeBlock(dayIndex, e, block.id)
                    }
                    onMouseEnter={handleMouseEnterBlock}
                    onMouseLeave={handleMouseLeaveBlock}
                >
                    {block.id !== null && (
                        <TimeBlock
                            blockId={block.id}
                            scheduleId={scheduleId}
                            className={
                                block.id === bouncingBlockId ? 'bouncing' : ''
                            }
                            top={top}
                            height={height}
                            color={scheduleColor}
                            bgColor={scheduleBgColor}
                            opacity={opacity}
                            zIndex={zIndex}
                            timeRange={timeRange}
                        />
                    )}
                </div>
            )
        }

        return (
            timeBlocks[scheduleId]
                ?.filter(
                    block =>
                        block.dayIndex === dayIndex &&
                        shouldRenderBlock(
                            block,
                            currentBlock?.id,
                            isResizingRef.current,
                            isRepositioningRef.current
                        )
                )
                .map(renderBlock) || []
        )
    }

    return (
        <div className="container" ref={gridRef} onMouseMove={handleMouseMove}>
            {hoverPosition !== null && (
                <HoverLine top={hoverPosition} isVisible={isHoverLineVisible} />
            )}
            {daysOfWeek.map((day, dayIndex) => (
                <div
                    key={dayIndex}
                    className="day-column"
                    onMouseDown={e => handleMouseDownOnDayColumn(dayIndex, e)}
                >
                    <div className="day-header">{day}</div>
                    {Array.from({ length: 24 }).map((_, intervalIndex) => (
                        <IntervalLine key={intervalIndex} />
                    ))}
                    {schedules.map(
                        schedule =>
                            (schedule.isActive ||
                                schedule.id === selectedSchedule) &&
                            renderTimeBlocks(
                                schedule.id,
                                schedule.id === selectedSchedule ? 0.8 : 0.6,
                                dayIndex,
                                schedule.id === selectedSchedule ? 2 : 1
                            )
                    )}
                    {currentBlock?.dayIndex === dayIndex &&
                        timeBlockPreviewProps && (
                            <TimeBlockPreview
                                {...timeBlockPreviewProps}
                                bgColor={
                                    getScheduleDetails(selectedSchedule)
                                        ?.bgColor
                                }
                                color={
                                    getScheduleDetails(selectedSchedule)?.color
                                }
                            />
                        )}
                </div>
            ))}
        </div>
    )
}
