import React, { useState } from 'react'
import { useTimeBlockContext } from '../../context/TimeBlockContext'

interface TimeBlockProps {
    top: number
    height: number
    onDelete: React.MouseEventHandler<HTMLButtonElement>
    className?: string
    color?: string
    bgColor?: string
    opacity?: number // Prop for controlling opacity
    zIndex?: number // Prop for controlling z-index
    scheduleId: string // Add scheduleId to differentiate
}

const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const TimeBlock: React.FC<TimeBlockProps> = ({
    top,
    height,
    onDelete,
    className = '',
    color = '#007bff',
    bgColor = '#e0e0e0',
    opacity = 1,
    zIndex = 1,
    scheduleId,
}) => {
    const { selectedSchedule, setSelectedSchedule } = useTimeBlockContext()
    const [isUnlocked, setIsUnlocked] = useState(false)

    // Determine border color based on selection status
    const borderColor = scheduleId === selectedSchedule ? color : bgColor

    const handleLockClick = () => {
        setIsUnlocked(true)
        setSelectedSchedule(scheduleId) // Update the selected schedule to the current scheduleId
    }

    return (
        <div
            data-testid="time-block"
            className={`time-block ${className}`}
            style={{
                top: `${top}px`,
                height: `${height}px`,
                backgroundColor: hexToRgba(bgColor, opacity), // Apply opacity to background
                borderColor, // Apply dynamic border color
                borderWidth: '1px', // Set border width to 1px
                borderStyle: 'solid', // Ensure border style is solid
                zIndex, // Apply z-index
                position: 'absolute', // Ensure z-index is effective
                overflow: 'hidden', // Ensure child elements are contained
            }}
        >
            {/* Conditionally render the padlock icon */}
            {scheduleId !== selectedSchedule && (
                <div
                    className={`padlock-icon ${isUnlocked ? 'unlocked' : ''}`}
                    onClick={handleLockClick}
                    style={{
                        position: 'absolute',
                        top: '4px',
                        left: '4px',
                        color,
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 70 70"
                        width="18"
                        height="18"
                        fill="currentColor"
                    >
                        <rect
                            x="22"
                            y="30"
                            width="26"
                            height="26"
                            rx="2"
                            ry="2"
                        />
                        <path
                            className="padlock-latch"
                            d="M27 40 V20 C30 14, 40 14, 43 20 V30"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                    </svg>
                </div>
            )}
            <button
                className="bin-icon"
                onClick={e => {
                    e.stopPropagation() // Stop event propagation
                    onDelete(e)
                }}
                aria-label="Delete time block"
                style={{
                    backgroundColor: hexToRgba(color, opacity),
                    border: 'none',
                    cursor: 'pointer',
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 64 64"
                    width="16"
                    height="16"
                    fill={bgColor}
                >
                    <rect x="16" y="24" width="32" height="32" rx="2" ry="2" />
                    <g className="bin-lid">
                        <rect
                            x="14"
                            y="14"
                            width="36"
                            height="8"
                            rx="1"
                            ry="1"
                        />
                    </g>
                </svg>
            </button>
        </div>
    )
}
