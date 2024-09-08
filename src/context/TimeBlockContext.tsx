import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    useCallback,
} from 'react'
import type { TimeBlock, Schedule, Note } from '../db'
import { useFetchSchedules } from '../controllers/useFetchSchedules'
import { useLoadTimeBlocks } from '../controllers/useLoadTimeBlocks'
import { useSaveData } from '../controllers/useSaveData'
import { useNotes } from '../controllers/useNotes'
import { deleteTimeBlockById, deleteScheduleById } from '../db' // Import necessary functions

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
    deleteTimeBlock: (timeBlockId: string, scheduleId: string) => Promise<void>
    deleteSchedule: (scheduleId: string) => Promise<void>
    notes: Record<string, Note | null>
    setNoteForTimeBlock: (timeBlockId: string, content: string) => void
    deleteNoteForTimeBlock: (timeBlockId: string) => void
    isHoverLineVisible: boolean
    setIsHoverLineVisible: React.Dispatch<React.SetStateAction<boolean>>
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
    const [isHoverLineVisible, setIsHoverLineVisible] = useState<boolean>(true)

    const { notes, setNoteForTimeBlock, deleteNoteForTimeBlock } = useNotes()

    useFetchSchedules(setSchedules, setSelectedSchedule, setTimeBlocks)
    useLoadTimeBlocks(schedules, setTimeBlocks, setNoteForTimeBlock)
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

    const deleteTimeBlock = useCallback(
        async (timeBlockId: string, scheduleId: string) => {
            try {
                // Delete from database
                await deleteTimeBlockById(timeBlockId)

                // Update the state to remove the time block
                setTimeBlocks(prevBlocks => {
                    const updatedBlocks = { ...prevBlocks }
                    const scheduleBlocks = updatedBlocks[scheduleId] || []
                    const newBlocks = scheduleBlocks.filter(
                        block => block.id !== timeBlockId
                    )
                    return {
                        ...updatedBlocks,
                        [scheduleId]: newBlocks,
                    }
                })

                // Optionally, handle note deletion if necessary
                deleteNoteForTimeBlock(timeBlockId)
            } catch (error) {
                console.error('Failed to delete time block:', error)
            }
        },
        [deleteNoteForTimeBlock]
    )

    const deleteSchedule = useCallback(
        async (scheduleId: string) => {
            try {
                await deleteScheduleById(scheduleId)

                // Update the local state to reflect the change
                setSchedules(prevSchedules =>
                    prevSchedules.filter(schedule => schedule.id !== scheduleId)
                )
                setTimeBlocks(prevBlocks => {
                    const updatedBlocks = { ...prevBlocks }
                    delete updatedBlocks[scheduleId]
                    return updatedBlocks
                })

                // Clear selected schedule if it was deleted
                if (selectedSchedule === scheduleId) {
                    setSelectedSchedule(null)
                }
            } catch (error) {
                console.error('Failed to delete schedule:', error)
            }
        },
        [selectedSchedule]
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
            deleteTimeBlock,
            deleteSchedule,
            notes,
            setNoteForTimeBlock,
            deleteNoteForTimeBlock,
            isHoverLineVisible,
            setIsHoverLineVisible,
        }),
        [
            timeBlocks,
            currentBlock,
            clearAllBlocks,
            recentBlockId,
            schedules,
            selectedSchedule,
            updateBlockPosition,
            deleteTimeBlock,
            deleteSchedule,
            notes,
            isHoverLineVisible,
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
