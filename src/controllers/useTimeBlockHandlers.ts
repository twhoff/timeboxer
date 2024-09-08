import { useState, useEffect, RefObject, MouseEvent } from 'react'
import { RESIZE_THRESHOLD } from '../constants/constants'
import { useTimeBlockContext } from '../context/TimeBlockContext'

interface BubblePosition {
    top: number
    left: number
}

interface UseTimeBlockHandlersParams {
    blockRef: RefObject<HTMLDivElement>
    blockId: string
    scheduleId: string
    triggerConfetti: (x: number, y: number) => void
}

interface UseTimeBlockHandlersReturn {
    handleLockClick: () => void
    handleMouseMove: (e: MouseEvent<HTMLDivElement>) => void
    handleDeleteClick: (e: MouseEvent<HTMLButtonElement>) => void
    handleNoteIconClick: (e: MouseEvent<HTMLButtonElement>) => void
    bubblePosition: BubblePosition
    localCursorStyle: string
    isTyping: boolean
    isNoteBubbleVisible: boolean
    setIsNoteBubbleVisible: (visible: boolean) => void
    setBubblePosition: (position: BubblePosition) => void
    isUnlocked: boolean
}

export const useTimeBlockHandlers = ({
    blockRef,
    blockId,
    scheduleId,
    triggerConfetti,
}: UseTimeBlockHandlersParams): UseTimeBlockHandlersReturn => {
    const [bubblePosition, setBubblePosition] = useState<BubblePosition>({
        top: 0,
        left: 0,
    })
    const [localCursorStyle, setLocalCursorStyle] = useState<string>('default')
    const [isTyping, setIsTyping] = useState<boolean>(false)
    const [isNoteBubbleVisible, setIsNoteBubbleVisible] =
        useState<boolean>(false)
    const [isUnlocked, setIsUnlocked] = useState<boolean>(false)

    const { setTimeBlocks, setSelectedSchedule, notes } = useTimeBlockContext()

    const handleLockClick = () => {
        setIsUnlocked(true)
        setSelectedSchedule(scheduleId)
    }

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const blockRect = blockRef.current?.getBoundingClientRect()
        if (!blockRect) return

        const mouseYRelativeToBlock = e.clientY - blockRect.top
        const isNearTop = mouseYRelativeToBlock <= RESIZE_THRESHOLD
        const isNearBottom =
            blockRect.height - mouseYRelativeToBlock <= RESIZE_THRESHOLD

        if (!e.metaKey && !e.shiftKey) {
            if (isNearTop || isNearBottom) {
                setLocalCursorStyle('ns-resize')
            } else {
                setLocalCursorStyle('default')
            }
        }
    }

    const handleDeleteClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
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

    const handleNoteIconClick = (e: MouseEvent<HTMLButtonElement>) => {
        const mouseX = e.clientX
        const mouseY = e.clientY
        setBubblePosition({ top: mouseY, left: mouseX })
        setIsNoteBubbleVisible(!isNoteBubbleVisible)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (notes[blockId]) {
            setIsTyping(true)
            setTimeout(() => setIsTyping(false), 300)
        }

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
        if (!notes[blockId]) {
            document.body.style.cursor = 'default'
            setLocalCursorStyle('default')
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
            document.body.style.cursor = 'default'
        }
    }, [notes, blockId])

    return {
        handleLockClick,
        handleMouseMove,
        handleDeleteClick,
        handleNoteIconClick,
        bubblePosition,
        localCursorStyle,
        isTyping,
        isNoteBubbleVisible,
        setIsNoteBubbleVisible,
        setBubblePosition,
        isUnlocked,
    }
}
