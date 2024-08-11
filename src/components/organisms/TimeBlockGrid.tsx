import React, { useState, useEffect } from 'react'
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
    const { timeBlocks, setTimeBlocks, recentBlockId } = useTimeBlockContext()
    const { handleMouseDown, blockProps } = useTimeBlockPlacement()
    const triggerConfetti = useConfetti()
    const [activeDay, setActiveDay] = useState<number | null>(null)
    const [bouncingBlockId, setBouncingBlockId] = useState<string | null>(null)

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
            if (updatedBlocks[dayIndex]) {
                updatedBlocks[dayIndex] = updatedBlocks[dayIndex].filter(
                    block => block.id !== blockId
                )
            }
            return updatedBlocks
        })
    }

    const handleMouseDownWithActiveDay = (
        dayIndex: number,
        e: React.MouseEvent<HTMLDivElement>
    ) => {
        setActiveDay(dayIndex)
        handleMouseDown(dayIndex, e)
    }

    return (
        <div className="container">
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
                    {(timeBlocks[dayIndex] || []).map(block => (
                        <div key={block.id}>
                            {block.id !== null && (
                                <TimeBlock
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
                                />
                            )}
                        </div>
                    ))}
                    {activeDay === dayIndex && blockProps && (
                        <TimeBlockPreview blockProps={blockProps} />
                    )}
                </div>
            ))}
        </div>
    )
}
