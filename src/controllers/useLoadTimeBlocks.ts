import { useEffect } from 'react'
import { loadTimeBlocks, TimeBlock, Schedule } from '../db'

export const useLoadTimeBlocks = (
    schedules: Schedule[],
    setTimeBlocks: React.Dispatch<
        React.SetStateAction<Record<string, TimeBlock[]>>
    >
) => {
    useEffect(() => {
        schedules.forEach(schedule => {
            if (schedule.isActive && !(schedule.id in setTimeBlocks)) {
                loadTimeBlocks(schedule.id).then(loadedTimeBlocks => {
                    setTimeBlocks(prevBlocks => ({
                        ...prevBlocks,
                        [schedule.id]: loadedTimeBlocks,
                    }))
                })
            }
        })
    }, [schedules, setTimeBlocks])
}
