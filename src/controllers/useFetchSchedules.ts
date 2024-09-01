import { useEffect } from 'react'
import {
    loadSchedules,
    loadTimeBlocks,
    type Schedule,
    type TimeBlock,
} from '../db'

export const useFetchSchedules = (
    setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>,
    setSelectedSchedule: React.Dispatch<React.SetStateAction<string | null>>,
    setTimeBlocks: React.Dispatch<
        React.SetStateAction<Record<string, TimeBlock[]>>
    >
) => {
    useEffect(() => {
        const fetchSchedules = async () => {
            const loadedSchedules = await loadSchedules()

            setSchedules(loadedSchedules)
            setSelectedSchedule(
                loadedSchedules.length ? loadedSchedules[0].id : null
            )

            loadedSchedules.forEach(schedule => {
                loadTimeBlocks(schedule.id).then(
                    (loadedTimeBlocks: TimeBlock[]) => {
                        setTimeBlocks(prevBlocks => ({
                            ...prevBlocks,
                            [schedule.id]: loadedTimeBlocks,
                        }))
                    }
                )
            })
        }
        fetchSchedules()
    }, [setSchedules, setSelectedSchedule, setTimeBlocks])
}
