import React, { useEffect } from 'react'
import { useTimeBlockContext } from '../../context/TimeBlockContext'
import { TimeBlock } from '../molecules/TimeBlock'
import { IntervalLine } from '../atoms/IntervalLine'
import { useTimeBlockPlacement } from '../../controllers/useTimeBlockPlacement'
import { useConfetti } from '../../controllers/useConfetti'

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

export const TimeBlockGrid: React.FC = () => {
    const { timeBlocks, setTimeBlocks } = useTimeBlockContext()
    const { handleMouseDown, timeIndicator } = useTimeBlockPlacement()

    const deleteTimeBlock = (
        dayIndex: number,
        blockIndex: number,
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.stopPropagation()
        const rect = e.currentTarget.getBoundingClientRect()
        useConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2)

        setTimeBlocks(prevBlocks => {
            const updatedBlocks = { ...prevBlocks }
            updatedBlocks[dayIndex].splice(blockIndex, 1)
            return updatedBlocks
        })
    }

    useEffect(() => {
        console.log('timeIndicator: ', timeIndicator)
    }, [timeIndicator])

    return (
        <div className="container">
            {daysOfWeek.map((day, dayIndex) => (
                <div
                    key={dayIndex}
                    className="day-column"
                    onMouseDown={e => handleMouseDown(dayIndex, e)}
                >
                    <div className="day-header">{day}</div>
                    {Array.from({ length: 24 }).map((_, intervalIndex) => (
                        <IntervalLine key={intervalIndex} />
                    ))}
                    {(timeBlocks[dayIndex] || []).map((block, blockIndex) => (
                        <TimeBlock
                            key={blockIndex}
                            top={block.start * INTERVAL_HEIGHT}
                            height={(block.end - block.start) * INTERVAL_HEIGHT}
                            onDelete={e =>
                                deleteTimeBlock(dayIndex, blockIndex, e)
                            }
                        />
                    ))}
                </div>
            ))}
            <div className="time-indicator">{timeIndicator}</div>
        </div>
    )
}
