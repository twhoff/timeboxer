// TimeBlockContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    useCallback,
} from 'react'

export interface TimeBlock {
    dayIndex: number
    start: number
    end: number
}

interface TimeBlocks {
    [key: number]: TimeBlock[]
}

interface TimeBlockContextType {
    timeBlocks: TimeBlocks
    setTimeBlocks: React.Dispatch<React.SetStateAction<TimeBlocks>>
    currentBlock: TimeBlock | null
    setCurrentBlock: React.Dispatch<React.SetStateAction<TimeBlock | null>>
    clearAllBlocks: () => void
}

const TimeBlockContext = createContext<TimeBlockContextType | undefined>(
    undefined
)

export const TimeBlockProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [timeBlocks, setTimeBlocks] = useState<TimeBlocks>({})
    const [currentBlock, setCurrentBlock] = useState<TimeBlock | null>(null)

    const clearAllBlocks = useCallback(() => {
        setTimeBlocks({})
    }, [])

    const value = useMemo(
        () => ({
            timeBlocks,
            setTimeBlocks,
            currentBlock,
            setCurrentBlock,
            clearAllBlocks,
        }),
        [timeBlocks, currentBlock, clearAllBlocks]
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
