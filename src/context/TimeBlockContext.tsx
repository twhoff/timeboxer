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
} from '../db'

export interface TimeBlock {
    id: string
    dayIndex: number
    start: number
    end: number
}

export interface Schedule {
    id: string
    name: string
    isActive: boolean
}

export interface TimeBlocks {
    [key: number]: TimeBlock[]
}

interface TimeBlockContextType {
    timeBlocks: TimeBlocks
    setTimeBlocks: React.Dispatch<React.SetStateAction<TimeBlocks>>
    currentBlock: TimeBlock | null
    setCurrentBlock: React.Dispatch<React.SetStateAction<TimeBlock | null>>
    clearAllBlocks: () => void
    recentBlockId: string | null
    setRecentBlockId: React.Dispatch<React.SetStateAction<string | null>>
    schedules: Schedule[]
    setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>
}

export const TimeBlockContext = createContext<TimeBlockContextType | undefined>(
    undefined
)

export const TimeBlockProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [timeBlocks, setTimeBlocks] = useState<TimeBlocks>({})
    const [currentBlock, setCurrentBlock] = useState<TimeBlock | null>(null)
    const [recentBlockId, setRecentBlockId] = useState<string | null>(null)
    const [schedules, setSchedules] = useState<Schedule[]>([])

    useEffect(() => {
        const fetchTimeBlocks = async () => {
            const savedBlocks = await loadTimeBlocks()
            if (savedBlocks) {
                setTimeBlocks(savedBlocks as TimeBlocks)
            }
        }
        fetchTimeBlocks()
    }, [])

    useEffect(() => {
        const saveBlocks = async () => {
            await saveTimeBlocks(timeBlocks)
        }
        saveBlocks()
    }, [timeBlocks])

    useEffect(() => {
        const fetchSchedules = async () => {
            const loadedSchedules = await loadSchedules()
            setSchedules(loadedSchedules)
        }
        fetchSchedules()
    }, [])

    useEffect(() => {
        const saveCurrentSchedules = async () => {
            await saveSchedules(schedules)
        }
        saveCurrentSchedules()
    }, [schedules])

    const clearAllBlocks = useCallback(() => {
        setTimeBlocks({})
        setRecentBlockId(null)
    }, [])

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
        }),
        [timeBlocks, currentBlock, clearAllBlocks, recentBlockId, schedules]
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
