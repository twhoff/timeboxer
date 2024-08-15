import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    useCallback,
    useEffect,
} from 'react'
import {
    loadTimeBlocks,
    saveTimeBlocks,
    loadSchedules,
    saveSchedules,
    type TimeBlock,
    type Schedule,
} from '../db'

interface TimeBlockContextType {
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

    useEffect(() => {
        const fetchSchedules = async () => {
            const loadedSchedules = await loadSchedules()
            setSchedules(loadedSchedules)
            setSelectedSchedule(null)
            loadedSchedules.forEach(schedule => {
                if (schedule.isActive) {
                    loadTimeBlocks(schedule.id).then(
                        (loadedTimeBlocks: TimeBlock[]) => {
                            setTimeBlocks(prevBlocks => ({
                                ...prevBlocks,
                                [schedule.id]: loadedTimeBlocks,
                            }))
                        }
                    )
                }
            })
        }
        fetchSchedules()
    }, [])

    useEffect(() => {
        const saveCurrentSchedules = async () => {
            await saveSchedules(schedules)
        }
        saveCurrentSchedules()
    }, [schedules])

    useEffect(() => {
        schedules.forEach(schedule => {
            if (schedule.isActive && !(schedule.id in timeBlocks)) {
                loadTimeBlocks(schedule.id).then(loadedTimeBlocks => {
                    setTimeBlocks(prevBlocks => ({
                        ...prevBlocks,
                        [schedule.id]: loadedTimeBlocks,
                    }))
                })
            }
        })
    }, [schedules, timeBlocks])

    useEffect(() => {
        if (selectedSchedule) {
            const saveCurrentTimeBlocks = async () => {
                await saveTimeBlocks(
                    selectedSchedule,
                    timeBlocks[selectedSchedule] || []
                )
            }
            saveCurrentTimeBlocks()
        }
    }, [timeBlocks, selectedSchedule])

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
        }),
        [
            timeBlocks,
            currentBlock,
            clearAllBlocks,
            recentBlockId,
            schedules,
            selectedSchedule,
            updateBlockPosition,
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
