import { useCallback, useState } from 'react'
import { Note } from '../db'
import { saveNote, deleteNoteById } from '../db'

export const useNotes = () => {
    const [notes, setNotes] = useState<Record<string, Note | null>>({})

    const setNoteForTimeBlock = useCallback(
        async (timeBlockId: string, content: string) => {
            if (content.trim() === '') {
                await deleteNoteForTimeBlock(timeBlockId)
                return
            }
            const note = { id: timeBlockId, timeBlockId, content }
            setNotes(prevNotes => ({
                ...prevNotes,
                [timeBlockId]: note,
            }))
            await saveNote(note)
        },
        []
    )

    const deleteNoteForTimeBlock = useCallback(async (timeBlockId: string) => {
        setNotes(prevNotes => {
            const updatedNotes = { ...prevNotes }
            delete updatedNotes[timeBlockId]
            return updatedNotes
        })
        await deleteNoteById(timeBlockId)
    }, [])

    return {
        notes,
        setNoteForTimeBlock,
        deleteNoteForTimeBlock,
    }
}
