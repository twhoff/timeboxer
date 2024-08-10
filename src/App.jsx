import React, { useEffect, useState } from 'react' // Removed unused useRef
import './App.css'
import { saveTimeBlocks, loadTimeBlocks } from './db'
import confetti from 'canvas-confetti'
const INTERVAL_HEIGHT = 40 // Static height for each interval

const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
]
const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)

const App = () => {
    const [timeBlocks, setTimeBlocks] = useState({})
    const [currentBlock, setCurrentBlock] = useState(null)
    const [timeIndicator, setTimeIndicator] = useState('')

    useEffect(() => {
        const fetchTimeBlocks = async () => {
            const savedBlocks = await loadTimeBlocks()
            if (savedBlocks) {
                setTimeBlocks(savedBlocks)
                console.log('Time blocks loaded from IndexedDB')
            }
        }
        fetchTimeBlocks()
    }, [])

    useEffect(() => {
        const saveBlocks = async () => {
            await saveTimeBlocks(timeBlocks)
            console.log('Time blocks saved to IndexedDB')
        }
        saveBlocks()
    }, [timeBlocks])

    useEffect(() => {
        const mouseMoveHandler = moveEvent => {
            if (!currentBlock) return
            const column =
                document.querySelectorAll('.day-column')[currentBlock.dayIndex]
            const rect = column.getBoundingClientRect()
            const headerHeight =
                column.querySelector('.day-header').offsetHeight
            const currentY = moveEvent.clientY - rect.top - headerHeight
            const endInterval = Math.round(currentY / INTERVAL_HEIGHT) // Snap to nearest interval
            const start = Math.min(currentBlock.start, endInterval)
            const end = Math.max(currentBlock.start, endInterval)
            const finalEnd = start === end ? end + 1 : end
            const startHour = start
            const endHour = finalEnd
            const formatTime = hour => {
                const period = hour >= 12 ? 'PM' : 'AM'
                const formattedHour = hour % 12 === 0 ? 12 : hour % 12
                return `${formattedHour}:00${period}`
            }
            const timeRange = `${formatTime(startHour)} - ${formatTime(
                endHour + 1
            )}`
            setTimeIndicator(timeRange)
            setCurrentBlock(prevBlock => ({ ...prevBlock, end: finalEnd }))
        }

        const mouseUpHandler = () => {
            if (currentBlock) {
                const { dayIndex, start, end } = currentBlock
                const newBlock = {
                    start: Math.min(start, end),
                    end:
                        start === end
                            ? Math.max(start, end) + 1
                            : Math.max(start, end),
                }

                setTimeBlocks(prevBlocks => ({
                    ...prevBlocks,
                    [dayIndex]: [...(prevBlocks[dayIndex] || []), newBlock],
                }))

                console.log(`Mouse up on day ${dayIndex}`)
            }

            setCurrentBlock(null)
            setTimeIndicator('')
            document.removeEventListener('mousemove', mouseMoveHandler)
            document.removeEventListener('mouseup', mouseUpHandler)
        }

        if (currentBlock) {
            document.addEventListener('mousemove', mouseMoveHandler)
            document.addEventListener('mouseup', mouseUpHandler)
        }

        return () => {
            document.removeEventListener('mousemove', mouseMoveHandler)
            document.removeEventListener('mouseup', mouseUpHandler)
        }
    }, [currentBlock])

    const handleMouseDown = (dayIndex, e) => {
        const column = e.currentTarget
        const rect = column.getBoundingClientRect()
        const headerHeight = column.querySelector('.day-header').offsetHeight
        const startY = e.clientY - rect.top - headerHeight
        const startInterval = Math.floor(startY / INTERVAL_HEIGHT)
        setCurrentBlock({ dayIndex, start: startInterval, end: startInterval })
    }

    const deleteTimeBlock = (dayIndex, blockIndex, e) => {
        e.stopPropagation()
        const rect = e.target.getBoundingClientRect()
        launchConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2)

        setTimeBlocks(prevBlocks => {
            const updatedBlocks = { ...prevBlocks }
            updatedBlocks[dayIndex].splice(blockIndex, 1)
            return updatedBlocks
        })
    }

    const launchConfetti = (x, y) => {
        confetti({
            particleCount: 150,
            spread: 70,
            startVelocity: 30,
            origin: {
                x: x / window.innerWidth,
                y: y / window.innerHeight,
            },
        })
    }

    return (
        <div className="app-container">
            <div className="scale-column">
                {hours.map((hour, index) => (
                    <div key={index} className="time-label">
                        {hour}
                    </div>
                ))}
            </div>
            <div className="container">
                {daysOfWeek.map((day, dayIndex) => (
                    <div
                        key={dayIndex}
                        className="day-column"
                        onMouseDown={e => handleMouseDown(dayIndex, e)}
                    >
                        <div className="day-header">{day}</div>
                        {Array.from({ length: 24 }).map((_, intervalIndex) => (
                            <div
                                key={intervalIndex}
                                className="interval-line"
                                style={{ height: INTERVAL_HEIGHT }}
                            ></div>
                        ))}
                        {(timeBlocks[dayIndex] || []).map(
                            (block, blockIndex) => (
                                <div
                                    key={blockIndex}
                                    className="time-block"
                                    style={{
                                        top: block.start * INTERVAL_HEIGHT,
                                        height:
                                            (block.end - block.start) *
                                            INTERVAL_HEIGHT,
                                        opacity: 1,
                                    }}
                                >
                                    <button
                                        className="bin-icon"
                                        onClick={e =>
                                            deleteTimeBlock(
                                                dayIndex,
                                                blockIndex,
                                                e
                                            )
                                        }
                                        aria-label="Delete time block"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 448 512"
                                            width="16"
                                            height="16"
                                            fill="#007bff"
                                        >
                                            <path d="..."></path>
                                        </svg>
                                    </button>
                                </div>
                            )
                        )}
                        {currentBlock && currentBlock.dayIndex === dayIndex && (
                            <div
                                className="time-block"
                                style={{
                                    top:
                                        Math.min(
                                            currentBlock.start,
                                            currentBlock.end
                                        ) * INTERVAL_HEIGHT,
                                    height:
                                        Math.abs(
                                            currentBlock.end -
                                                currentBlock.start
                                        ) * INTERVAL_HEIGHT,
                                    opacity: 0.7,
                                    position: 'absolute',
                                }}
                            >
                                <div
                                    className="time-indicator"
                                    style={{
                                        position: 'absolute',
                                        left: '50%',
                                        top: (() => {
                                            const difference = Math.abs(
                                                currentBlock.end -
                                                    currentBlock.start
                                            )
                                            if (difference > 8) return '50%'
                                            return currentBlock.end <
                                                currentBlock.start
                                                ? '-20px'
                                                : 'auto'
                                        })(),
                                        bottom: (() => {
                                            const difference = Math.abs(
                                                currentBlock.end -
                                                    currentBlock.start
                                            )
                                            if (
                                                difference <= 8 &&
                                                currentBlock.end >=
                                                    currentBlock.start
                                            ) {
                                                return '-20px'
                                            }
                                            return 'auto'
                                        })(),
                                        transform:
                                            Math.abs(
                                                currentBlock.end -
                                                    currentBlock.start
                                            ) > 8
                                                ? 'translate(-50%, -50%)'
                                                : 'translateX(-50%)',
                                    }}
                                >
                                    {timeIndicator}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default App
