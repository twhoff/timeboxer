import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    useCallback,
} from 'react'
import type { TimeBlock, Schedule, Note } from '../db' // Ensure Note is imported here
import { useFetchSchedules } from '../controllers/useFetchSchedules'
import { useLoadTimeBlocks } from '../controllers/useLoadTimeBlocks'
import { useSaveData } from '../controllers/useSaveData'
import { useNotes } from '../controllers/useNotes' // Import the custom hook

export interface TimeBlockContextType {
    timeBlocks: Record<string, TimeBlock[]>
    setTimeBlocks: React.Dispatch<
        React.SetStateAction<Record<string, TimeBlock[]>>
    >
    currentBlock: TimeBlock | null
    setCurrentBlock: React.Dispatch<React.SetStateAction<TimeBlock | null>>
    clearAllBlocks: () => void
    recentBlockId: string | null
    setRecentBlockId: React.Dispatch<React.SetStateAction<string | null>>
    schedules: Schedule[]
    setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>
    selectedSchedule: string | null
    setSelectedSchedule: React.Dispatch<React.SetStateAction<string | null>>
    updateBlockPosition: (
        scheduleId: string,
        blockId: string,
        newDayIndex: number,
        newStart: number,
        newEnd: number
    ) => void
    notes: Record<string, Note | null>
    setNoteForTimeBlock: (timeBlockId: string, content: string) => void
    deleteNoteForTimeBlock: (timeBlockId: string) => void
}

export const TimeBlockContext = createContext<TimeBlockContextType | undefined>(
    undefined
)

export const TimeBlockProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [timeBlocks, setTimeBlocks] = useState<Record<string, TimeBlock[]>>(
        {}
    )
    const [currentBlock, setCurrentBlock] = useState<TimeBlock | null>(null)
    const [recentBlockId, setRecentBlockId] = useState<string | null>(null)
    const [schedules, setSchedules] = useState<Schedule[]>([])
    const [selectedSchedule, setSelectedSchedule] = useState<string | null>(
        null
    )

    const { notes, setNoteForTimeBlock, deleteNoteForTimeBlock } = useNotes() // Use the custom hook

    useFetchSchedules(setSchedules, setSelectedSchedule, setTimeBlocks)
    useLoadTimeBlocks(schedules, setTimeBlocks, setNoteForTimeBlock) // Remove setNotes, use setNoteForTimeBlock if needed
    useSaveData(schedules, timeBlocks, selectedSchedule)

    const clearAllBlocks = useCallback(() => {
        if (selectedSchedule) {
            setTimeBlocks(prevBlocks => ({
                ...prevBlocks,
                [selectedSchedule]: [],
            }))
            setRecentBlockId(null)
        }
    }, [selectedSchedule])

    const updateBlockPosition = useCallback(
        (
            scheduleId: string,
            blockId: string,
            newDayIndex: number,
            newStart: number,
            newEnd: number
        ) => {
            setTimeBlocks(prevBlocks => {
                const updatedBlocks = { ...prevBlocks }
                const scheduleBlocks = updatedBlocks[scheduleId] || []
                const blockIndex = scheduleBlocks.findIndex(
                    block => block.id === blockId
                )
                if (blockIndex !== -1) {
                    const updatedBlock = {
                        ...scheduleBlocks[blockIndex],
                        dayIndex: newDayIndex,
                        start: newStart,
                        end: newEnd,
                    }
                    scheduleBlocks[blockIndex] = updatedBlock
                }
                return {
                    ...updatedBlocks,
                    [scheduleId]: scheduleBlocks,
                }
            })
        },
        []
    )

    const value = useMemo(
        () => ({
            timeBlocks,
            setTimeBlocks,
            currentBlock,
            setCurrentBlock,
            clearAllBlocks,
            recentBlockId,
            setRecentBlockId,
            schedules,
            setSchedules,
            selectedSchedule,
            setSelectedSchedule,
            updateBlockPosition,
            notes,
            setNoteForTimeBlock,
            deleteNoteForTimeBlock,
        }),
        [
            timeBlocks,
            currentBlock,
            clearAllBlocks,
            recentBlockId,
            schedules,
            selectedSchedule,
            updateBlockPosition,
            notes,
        ]
    )

    return (
        <TimeBlockContext.Provider value={value}>
            {children}
        </TimeBlockContext.Provider>
    )
}

export const useTimeBlockContext = (): TimeBlockContextType => {
    const context = useContext(TimeBlockContext)
    if (!context) {
        throw new Error(
            'useTimeBlockContext must be used within a TimeBlockProvider'
        )
    }
    return context
}
