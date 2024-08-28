import { useEffect } from 'react'
import { saveSchedules, saveTimeBlocks, Schedule, TimeBlock } from '../db'

export const useSaveData = (
    schedules: Schedule[],
    timeBlocks: Record<string, TimeBlock[]>,
    selectedSchedule: string | null
) => {
    useEffect(() => {
        const saveCurrentSchedules = async () => {
            await saveSchedules(schedules)
        }
        saveCurrentSchedules()
    }, [schedules])

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
}
