import React, { useEffect, useState } from 'react'
import { useTimeBlockContext } from '../../context/TimeBlockContext'

interface TimeBlockProps {
    top: number
    height: number
    onDelete: React.MouseEventHandler<HTMLButtonElement>
    className?: string
    color?: string
    bgColor?: string
    opacity?: number
    zIndex?: number
    scheduleId: string
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

    const isSelectedSchedule = selectedSchedule === scheduleId
    const borderColor = isSelectedSchedule ? color : bgColor

    const handleLockClick = () => {
        setIsUnlocked(true)
        setSelectedSchedule(scheduleId)
    }

    useEffect(() => {
        if (!isSelectedSchedule) {
            setIsUnlocked(false)
        }
    }, [isSelectedSchedule])

    return (
        <div
            data-testid="time-block"
            className={`time-block ${className}`}
            style={{
                top: `${top}px`,
                height: `${height}px`,
                backgroundColor: hexToRgba(bgColor, opacity),
                borderColor,
                borderWidth: '1px',
                borderStyle: 'solid',
                zIndex,
                position: 'absolute',
                overflow: 'hidden',
            }}
        >
            <button
                className={`padlock-icon ${isUnlocked ? 'unlocked fadeout' : ''} ${isSelectedSchedule ? 'hidden' : ''}`}
                onClick={handleLockClick}
                aria-label="Toggle lock"
                style={{
                    position: 'absolute',
                    top: '-2px',
                    left: '-7px',
                    width: '24px',
                    height: '24px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color,
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 70 70"
                    width="16"
                    height="16"
                    fill="currentColor"
                >
                    <rect x="22" y="33" width="32" height="26" rx="2" ry="2" />{' '}
                    <path
                        className="padlock-latch"
                        d="M30 43 V23 C30 17, 46 17, 46 23 V33"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                </svg>
            </button>
            <button
                className="bin-icon"
                onClick={e => {
                    e.stopPropagation()
                    onDelete(e)
                }}
                aria-label="Delete time block"
                style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '4px',
                    width: '24px',
                    height: '24px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color,
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 64 64"
                    width="16"
                    height="16"
                    fill="currentColor"
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
