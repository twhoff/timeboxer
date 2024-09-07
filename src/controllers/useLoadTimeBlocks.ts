import { useEffect } from 'react'
import {
    loadTimeBlocks,
    loadNoteByTimeBlockId,
    TimeBlock,
    Schedule,
    Note,
} from '../db'

export const useLoadTimeBlocks = (
    schedules: Schedule[],
    setTimeBlocks: React.Dispatch<
        React.SetStateAction<Record<string, TimeBlock[]>>
    >,
    setNotes: React.Dispatch<React.SetStateAction<Record<string, Note | null>>>
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
                    const notes = await Promise.all(
                        loadedTimeBlocks.map(async block => {
                            const note = await loadNoteByTimeBlockId(block.id)
                            return note
                                ? { [block.id]: note }
                                : { [block.id]: null }
                        })
                    )

                    // Merge loaded notes into the state
                    setNotes(prevNotes => ({
                        ...prevNotes,
                        ...Object.assign({}, ...notes),
                    }))
                })
            }
        })
    }, [schedules, setTimeBlocks, setNotes])
}
