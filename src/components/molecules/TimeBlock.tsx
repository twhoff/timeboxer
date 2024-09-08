import React, { useRef, useState } from 'react'
import { useTimeBlockContext } from '../../context/TimeBlockContext'
import { useConfetti } from '../../controllers/useConfetti'
import { useTimeBlockHandlers } from '../../controllers/useTimeBlockHandlers'
import { hexToRgba } from '../../utils/colorGenerator'
import { LockButton } from '../atoms/LockButton'
import { DeleteButton } from '../atoms/DeleteButton'
import { NoteButton } from '../atoms/NoteButton'
import NoteBubble from '../organisms/NoteBubble'

interface TimeBlockProps {
    blockId: string
    top: number
    height: number
    className?: string
    color?: string
    bgColor?: string
    opacity?: number
    zIndex?: number
    scheduleId: string
    timeRange: string
}

export const TimeBlock: React.FC<TimeBlockProps> = ({
    blockId,
    top,
    height,
    className = '',
    color = '#007bff',
    bgColor = '#e0e0e0',
    opacity = 1,
    zIndex = 1,
    scheduleId,
    timeRange,
}) => {
    const triggerConfetti = useConfetti()
    const { notes, selectedSchedule } = useTimeBlockContext()
    const blockRef = useRef<HTMLDivElement | null>(null)
    const [isHovered, setIsHovered] = useState<boolean>(false)

    const {
        handleLockClick,
        handleMouseMove,
        handleDeleteClick,
        handleNoteIconClick,
        bubblePosition,
        localCursorStyle,
        isTyping,
        isNoteBubbleVisible,
        isUnlocked,
        setIsNoteBubbleVisible,
    } = useTimeBlockHandlers({
        blockRef,
        blockId,
        scheduleId,
        triggerConfetti,
    })

    const isSelectedSchedule = selectedSchedule === scheduleId

    return (
        <div
            data-testid="time-block-wrapper"
            className="time-block-wrapper"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: 'absolute',
                top: top - 10,
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
                    height,
                    backgroundColor: hexToRgba(bgColor, opacity),
                    borderColor:
                        isSelectedSchedule || isHovered ? color : bgColor,
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
                <LockButton
                    isUnlocked={isUnlocked} // Use the unlocked state from the hook
                    isSelected={isSelectedSchedule}
                    color={color}
                    onClick={handleLockClick}
                    isHovered={isHovered}
                />
                {isSelectedSchedule && (
                    <>
                        <DeleteButton
                            onClick={handleDeleteClick}
                            color={color}
                            isHovered={isHovered}
                        />
                        <NoteButton
                            notes={notes}
                            blockId={blockId}
                            onClick={handleNoteIconClick} // Ensure bubble position is set correctly
                            color={color}
                            isHovered={isHovered}
                            isTyping={isTyping}
                        />
                        {isNoteBubbleVisible && (
                            <NoteBubble
                                timeBlockId={blockId}
                                color={color}
                                bgColor={bgColor}
                                onClose={() => setIsNoteBubbleVisible(false)}
                                bubblePosition={bubblePosition} // Ensure position is passed correctly
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
