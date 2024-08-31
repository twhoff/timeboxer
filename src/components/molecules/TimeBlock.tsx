import React, { useEffect, useState, useRef } from 'react'
import { useTimeBlockContext } from '../../context/TimeBlockContext'

interface TimeBlockProps {
    blockId: string
    top: number
    height: number
    onDelete: React.MouseEventHandler<HTMLButtonElement>
    className?: string
    color?: string
    bgColor?: string
    opacity?: number
    zIndex?: number
    scheduleId: string
    timeRange: string
    blockProps?: {
        top: number
        height: number
    }
}

const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const TimeBlockComponent: React.FC<TimeBlockProps> = ({
    blockId,
    top,
    height,
    onDelete,
    className = '',
    color = '#007bff',
    bgColor = '#e0e0e0',
    opacity = 1,
    zIndex = 1,
    scheduleId,
    timeRange,
    blockProps,
}) => {
    const RESIZE_THRESHOLD = 5

    const { selectedSchedule, setSelectedSchedule } = useTimeBlockContext()
    const [isUnlocked, setIsUnlocked] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [localCursorStyle, setLocalCursorStyle] = useState<string>('default')
    const blockRef = useRef<HTMLDivElement | null>(null)

    const isSelectedSchedule = selectedSchedule === scheduleId
    const borderColor = isSelectedSchedule || isHovered ? color : bgColor

    const handleLockClick = () => {
        setIsUnlocked(true)
        setSelectedSchedule(scheduleId)
    }

    useEffect(() => {
        if (!isSelectedSchedule) {
            setIsUnlocked(false)
        }
    }, [isSelectedSchedule])

    useEffect(() => {
        if (blockProps) {
            console.log('Rendering TimeBlock with:', blockProps)
        }
    }, [blockProps])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.metaKey && e.shiftKey) {
                document.body.style.cursor = 'grab'
                setLocalCursorStyle('grab')
            } else if (e.metaKey) {
                document.body.style.cursor = 'ew-resize'
                setLocalCursorStyle('ew-resize')
            } else {
                document.body.style.cursor = 'default'
                setLocalCursorStyle('default')
            }
        }

        const handleKeyUp = () => {
            document.body.style.cursor = 'default'
            setLocalCursorStyle('default')
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
            document.body.style.cursor = 'default' // Reset on component unmount
        }
    }, [])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const blockRect = blockRef.current?.getBoundingClientRect()
        if (!blockRect) return

        const mouseYRelativeToBlock = e.clientY - blockRect.top
        const isNearTop = mouseYRelativeToBlock <= RESIZE_THRESHOLD
        const isNearBottom =
            blockRect.height - mouseYRelativeToBlock <= RESIZE_THRESHOLD

        if (!e.metaKey && !e.shiftKey) {
            // Apply local cursor logic only when CMD or CMD+SHIFT aren't pressed
            if (isNearTop || isNearBottom) {
                setLocalCursorStyle('ns-resize')
            } else {
                setLocalCursorStyle('default')
            }
        }
    }

    return (
        <div
            data-testid="time-block-wrapper"
            className="time-block-wrapper"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: 'absolute',
                top: blockProps?.top ?? top - 10,
                left: '-10px',
                right: '-10px',
                padding: '10px',
                zIndex,
                overflow: 'visible',
            }}
        >
            <div
                ref={blockRef}
                data-testid="time-block"
                className={`time-block ${className}`}
                onMouseMove={handleMouseMove}
                data-block-id={blockId}
                style={{
                    height: blockProps?.height ?? height,
                    backgroundColor: hexToRgba(bgColor, opacity),
                    borderColor,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    zIndex,
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: localCursorStyle,
                }}
            >
                {isHovered && (
                    <div
                        className="time-indicator"
                        style={{
                            backgroundColor: bgColor,
                            color: color,
                            borderTopColor: color,
                            borderRightColor: color,
                        }}
                    >
                        {timeRange}
                    </div>
                )}
                <button
                    className={`padlock-icon ${
                        isUnlocked ? 'unlocked fadeout' : ''
                    } ${isSelectedSchedule ? 'hidden' : ''}`}
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
                        opacity: isHovered ? 1 : 0,
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 70 70"
                        width="16"
                        height="16"
                        fill="currentColor"
                    >
                        <rect
                            x="22"
                            y="33"
                            width="32"
                            height="26"
                            rx="2"
                            ry="2"
                        />
                        <path
                            className="padlock-latch"
                            d="M30 43 V23 C30 17, 46 17, 46 23 V33"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                    </svg>
                </button>
                {isSelectedSchedule && (
                    <>
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
                                opacity: isHovered ? 1 : 0,
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 64 64"
                                width="16"
                                height="16"
                                fill="currentColor"
                            >
                                <rect
                                    x="16"
                                    y="24"
                                    width="32"
                                    height="32"
                                    rx="2"
                                    ry="2"
                                />
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
                        <button
                            className="note-icon"
                            aria-label="Edit time block"
                            style={{
                                position: 'absolute',
                                top: '0px',
                                right: '24px',
                                width: '24px',
                                height: '24px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color,
                                opacity: isHovered ? 1 : 0,
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 64 64"
                                width="16"
                                height="16"
                                className="mechanical-pencil"
                            >
                                <rect
                                    x="28"
                                    y="5"
                                    width="8"
                                    height="8"
                                    rx="2"
                                    ry="2"
                                    fill="currentColor"
                                    className="eraser"
                                />
                                <rect
                                    x="28"
                                    y="16"
                                    width="8"
                                    height="28"
                                    fill="currentColor"
                                    className="shaft"
                                />
                                <path
                                    d="M28 44 L32 50 L36 44 L32 47"
                                    fill="currentColor"
                                    className="sheathe"
                                />
                                <path
                                    d="M30 47 L32 54 L34 47"
                                    fill="currentColor"
                                    className="tip"
                                />
                            </svg>
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export const TimeBlock = React.memo(TimeBlockComponent)
