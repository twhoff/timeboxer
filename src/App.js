import React, { useEffect, useState } from 'react';
import './App.css';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

const App = () => {
    const [timeBlocks, setTimeBlocks] = useState({});
    const [currentBlock, setCurrentBlock] = useState(null);
    const [timeIndicator, setTimeIndicator] = useState('');

    useEffect(() => {
        const mouseMoveHandler = (moveEvent) => {
            if (!currentBlock) return;

            const column = document.querySelectorAll('.day-column')[currentBlock.dayIndex];
            const rect = column.getBoundingClientRect();
            const currentY = moveEvent.clientY - rect.top;
            const intervalHeight = column.offsetHeight / 96;
            const endInterval = Math.floor(currentY / intervalHeight);

            const start = Math.min(currentBlock.start, endInterval);
            const end = Math.max(currentBlock.start, endInterval);

            const startHour = Math.floor(start / 4);
            const startMinutes = (start % 4) * 15;
            const endHour = Math.floor(end / 4);
            const endMinutes = (end % 4) * 15;

            const formatTime = (hour, minutes) => {
                const period = hour >= 12 ? 'PM' : 'AM';
                const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
                return `${formattedHour}:${minutes.toString().padStart(2, '0')}${period}`;
            };

            const timeRange = `${formatTime(startHour, startMinutes)} - ${formatTime(endHour, endMinutes)}`;

            console.log(`Mouse move on day ${currentBlock.dayIndex}, time range: ${timeRange}`);
            setTimeIndicator(timeRange);

            setCurrentBlock((prevBlock) => ({
                ...prevBlock,
                end: endInterval,
            }));
        };

        const mouseUpHandler = () => {
            if (currentBlock) {
                const { dayIndex, start, end } = currentBlock;
                const newBlock = {
                    start: Math.min(start, end),
                    end: Math.max(start, end),
                };

                setTimeBlocks((prevBlocks) => ({
                    ...prevBlocks,
                    [dayIndex]: [...(prevBlocks[dayIndex] || []), newBlock],
                }));

                console.log(`Mouse up on day ${dayIndex}`);
            }

            setCurrentBlock(null);
            setTimeIndicator('');
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };

        if (currentBlock) {
            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        }

        return () => {
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };
    }, [currentBlock]);

    const handleMouseDown = (dayIndex, e) => {
        const startY = e.nativeEvent.offsetY;
        const column = e.currentTarget;
        const intervalHeight = column.offsetHeight / 96;
        const startInterval = Math.floor(startY / intervalHeight);

        console.log(`Mouse down on day ${dayIndex}, start interval: ${startInterval}`);

        setCurrentBlock({ dayIndex, start: startInterval, end: startInterval });
    };

    useEffect(() => {
        console.log('Time blocks updated:', timeBlocks);
    }, [timeBlocks]);

    return (
        <div className="app-container">
            <div className="scale-column">
                {hours.map((hour, index) => (
                    <div key={index} className="time-label">{hour}</div>
                ))}
            </div>
            <div className="container">
                {daysOfWeek.map((day, dayIndex) => (
                    <div
                        key={dayIndex}
                        className="day-column"
                        onMouseDown={(e) => handleMouseDown(dayIndex, e)}
                    >
                        <div className="day-header">{day}</div>
                        {Array.from({ length: 96 }).map((_, intervalIndex) => (
                            <div key={intervalIndex} className="interval-line"></div>
                        ))}
                        {(timeBlocks[dayIndex] || []).map((block, blockIndex) => (
                            <div
                                key={blockIndex}
                                className="time-block"
                                style={{
                                    top: `${(block.start / 96) * 100}%`,
                                    height: `${((block.end - block.start) / 96) * 100}%`,
                                    opacity: 1,
                                }}
                            />
                        ))}
                        {currentBlock && currentBlock.dayIndex === dayIndex && (
                            <div
                                className="time-block"
                                style={{
                                    top: `${(Math.min(currentBlock.start, currentBlock.end) / 96) * 100}%`,
                                    height: `${(Math.abs(currentBlock.end - currentBlock.start) / 96) * 100}%`,
                                    opacity: 0.7,
                                    position: 'relative',
                                }}
                            >
                                <div
                                    className="time-indicator"
                                    style={{
                                        position: 'absolute',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        [Math.abs(currentBlock.end - currentBlock.start) > 8 ? 'top' : (currentBlock.end < currentBlock.start ? 'top' : 'bottom')]: Math.abs(currentBlock.end - currentBlock.start) > 8 ? '50%' : '-20px',
                                        transform: Math.abs(currentBlock.end - currentBlock.start) > 8 ? 'translate(-50%, -50%)' : 'translateX(-50%)',
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
    );
};

export default App;