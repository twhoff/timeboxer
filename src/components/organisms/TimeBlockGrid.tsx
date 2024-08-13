import React, { useState, useEffect, useRef } from 'react'
import { useTimeBlockContext } from '../../context/TimeBlockContext'
import { TimeBlock } from '../molecules/TimeBlock'
import { IntervalLine } from '../atoms/IntervalLine'
import { useTimeBlockPlacement } from '../../controllers/useTimeBlockPlacement'
import { useConfetti } from '../../controllers/useConfetti'
import { TimeBlockPreview } from '../molecules/TimeBlockPreview'

const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
]

const INTERVAL_HEIGHT = 40
const HEADER_HEIGHT = 30

export const TimeBlockGrid: React.FC = () => {
    const {
        timeBlocks,
        setTimeBlocks,
        recentBlockId,
        selectedSchedule,
        schedules,
    } = useTimeBlockContext()
    const { handleMouseDown, blockProps } = useTimeBlockPlacement()
    const triggerConfetti = useConfetti()
    const [activeDay, setActiveDay] = useState<number | null>(null)
    const [bouncingBlockId, setBouncingBlockId] = useState<string | null>(null)
    const gridRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (recentBlockId) {
            console.log(`Most recent time block ID: ${recentBlockId}`)
            setBouncingBlockId(recentBlockId)
            const timer = setTimeout(() => {
                setBouncingBlockId(null)
            }, 800)

            return () => clearTimeout(timer)
        }
    }, [recentBlockId])

    const deleteTimeBlock = (
        dayIndex: number,
        blockId: string,
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.stopPropagation()
        console.log(
            `Deleting block with id: ${blockId} at dayIndex: ${dayIndex}`
        )
        const rect = e.currentTarget.getBoundingClientRect()
        triggerConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2)

        setTimeBlocks(prevBlocks => {
            const updatedBlocks = { ...prevBlocks }

            Object.keys(updatedBlocks).forEach(scheduleId => {
                updatedBlocks[scheduleId] = updatedBlocks[scheduleId].filter(
                    block => block.id !== blockId
                )
            })

            return updatedBlocks
        })
    }

    const handleMouseDownWithActiveDay = (
        dayIndex: number,
        e: React.MouseEvent<HTMLDivElement>
    ) => {
        const target = e.target as HTMLElement
        const isCmdClick = e.metaKey // Check if the command key is pressed
        // Handle cmd+click separately
        if (isCmdClick && target.closest('.time-block')) {
            console.log('Cmd+click on time block, initiating drag operation')
            handleMouseDown(dayIndex, e) // Allow cmd+click to initiate drag
            return
        }
        // For regular clicks, check if the click is on a time block
        if (target.closest('.time-block')) {
            console.log('Regular click on a time block, exiting handler')
            return // Exit if clicking on an existing time block
        }
        console.log(`Mouse down on day column: ${daysOfWeek[dayIndex]}`)
        const isButtonOrChild = (element: HTMLElement | null): boolean => {
            while (element) {
                if (element.tagName.toLowerCase() === 'button') {
                    console.log('Detected click on a button, ignoring.')
                    return true
                }
                element = element.parentElement
            }
            return false
        }
        if (isButtonOrChild(e.target as HTMLElement)) {
            console.log(
                'Click event originated from a button or its child; stopping propagation.'
            )
            e.stopPropagation()
            return
        }
        if (!selectedSchedule) {
            console.log('No schedule selected; showing alert.')
            alert('Please select a schedule before adding time blocks.')
            return
        }
        console.log(
            'Setting active day and proceeding with mouse down handling.'
        )
        setActiveDay(dayIndex)
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
        const scheduleDetails = getScheduleDetails(scheduleId)
        const scheduleColor = scheduleDetails?.color
        const scheduleBgColor = scheduleDetails?.bgColor

        return (
            timeBlocks[scheduleId]
                ?.filter(block => block.dayIndex === dayIndex)
                .map(block => (
                    <div key={block.id}>
                        {block.id !== null && (
                            <TimeBlock
                                blockId={block.id}
                                scheduleId={scheduleId}
                                className={
                                    block.id === bouncingBlockId
                                        ? 'bouncing'
                                        : ''
                                }
                                top={
                                    block.start * (INTERVAL_HEIGHT / 4) +
                                    HEADER_HEIGHT
                                }
                                height={
                                    (block.end - block.start) *
                                    (INTERVAL_HEIGHT / 4)
                                }
                                onDelete={e =>
                                    deleteTimeBlock(dayIndex, block.id, e)
                                }
                                color={scheduleColor}
                                bgColor={scheduleBgColor}
                                opacity={opacity}
                                zIndex={zIndex}
                            />
                        )}
                    </div>
                )) || []
        )
    }

    return (
        <div className="container" ref={gridRef}>
            {daysOfWeek.map((day, dayIndex) => (
                <div
                    key={dayIndex}
                    className="day-column"
                    onMouseDown={e => handleMouseDownWithActiveDay(dayIndex, e)}
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
                    {activeDay === dayIndex && blockProps && (
                        <TimeBlockPreview
                            blockProps={blockProps}
                            bgColor={
                                getScheduleDetails(selectedSchedule)?.bgColor
                            }
                        />
                    )}
                </div>
            ))}
        </div>
    )
}
