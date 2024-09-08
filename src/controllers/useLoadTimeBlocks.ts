import { useEffect } from 'react'
import {
    loadTimeBlocks,
    loadNoteByTimeBlockId,
    TimeBlock,
    Schedule,
} from '../db'

export const useLoadTimeBlocks = (
    schedules: Schedule[],
    setTimeBlocks: React.Dispatch<
        React.SetStateAction<Record<string, TimeBlock[]>>
    >,
    setNoteForTimeBlock: (timeBlockId: string, content: string) => void
) => {
    useEffect(() => {
        schedules.forEach(schedule => {
            if (schedule.isActive && !(schedule.id in setTimeBlocks)) {
                loadTimeBlocks(schedule.id).then(async loadedTimeBlocks => {
                    setTimeBlocks(prevBlocks => ({
                        ...prevBlocks,
                        [schedule.id]: loadedTimeBlocks,
                    }))

                    // Load notes for each time block
                    await Promise.all(
                        loadedTimeBlocks.map(async block => {
                            const note = await loadNoteByTimeBlockId(block.id)
                            if (note) {
                                setNoteForTimeBlock(block.id, note.content)
                            }
                        })
                    )
                })
            }
        })
    }, [schedules, setTimeBlocks, setNoteForTimeBlock])
}
