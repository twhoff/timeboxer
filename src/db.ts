import { openDB, IDBPDatabase, DBSchema } from 'idb'

const DB_NAME = 'TimeBlockDB'
const TIME_BLOCK_STORE = 'timeBlocks'
const SCHEDULE_STORE = 'schedules'
const NOTE_STORE = 'notes'
const ROTATOR_STORE = 'colorGeneratorRotatorValueStore'
const ROTATOR_KEY = 'colorGeneratorRotatorValue'

interface ExportedData {
    timeBlocks: TimeBlock[][]
    schedules: Schedule[][]
    notes: Note[]
    rotatorValue: number | undefined
}

export interface TimeBlock {
    id: string
    scheduleId: string
    dayIndex: number
    start: number
    end: number
    color: string
}

export interface Note {
    id: string
    timeBlockId: string
    content: string
}

export interface Schedule {
    id: string
    name: string
    isActive: boolean
    color: string
    bgColor: string
}

interface TimeBlockDB extends DBSchema {
    [TIME_BLOCK_STORE]: {
        key: string
        value: TimeBlock[]
    }
    [NOTE_STORE]: {
        key: string
        value: Note
    }
    [SCHEDULE_STORE]: {
        key: string
        value: Schedule[]
    }
    [ROTATOR_STORE]: {
        key: string
        value: number
    }
}

export async function initDB(): Promise<IDBPDatabase<TimeBlockDB>> {
    return openDB<TimeBlockDB>(DB_NAME, 4, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(TIME_BLOCK_STORE)) {
                db.createObjectStore(TIME_BLOCK_STORE)
            }
            if (!db.objectStoreNames.contains(NOTE_STORE)) {
                db.createObjectStore(NOTE_STORE)
            }
            if (!db.objectStoreNames.contains(SCHEDULE_STORE)) {
                db.createObjectStore(SCHEDULE_STORE)
            }
            if (!db.objectStoreNames.contains(ROTATOR_STORE)) {
                db.createObjectStore(ROTATOR_STORE)
            }
        },
    })
}

export async function exportData(): Promise<void> {
    try {
        const db = await initDB()
        const timeBlocks: TimeBlock[][] = await db.getAll(TIME_BLOCK_STORE)
        const schedules: Schedule[][] = await db.getAll(SCHEDULE_STORE)
        const notes: Note[] = await db.getAll(NOTE_STORE)
        const rotatorValue: number | undefined = await db.get(
            ROTATOR_STORE,
            ROTATOR_KEY
        )
        const data: ExportedData = {
            timeBlocks,
            schedules,
            notes,
            rotatorValue,
        }
        const jsonData = JSON.stringify(data, null, 2)
        const blob = new Blob([jsonData], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'data.json'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        console.log('Data exported successfully.')
    } catch (error) {
        console.error('Failed to export data:', error)
    }
}

export async function importData(jsonData: string): Promise<void> {
    try {
        const db = await initDB()
        const data: ExportedData = JSON.parse(jsonData)

        // Clear existing data
        await db.clear(TIME_BLOCK_STORE)
        await db.clear(SCHEDULE_STORE)
        await db.clear(NOTE_STORE)
        await db.put(ROTATOR_STORE, 0, ROTATOR_KEY) // Reset rotator value

        // Import new data
        const scheduleTimeBlocks: TimeBlock[][] = data.timeBlocks
        for (const timeBlocks of scheduleTimeBlocks) {
            await db.put(TIME_BLOCK_STORE, timeBlocks, timeBlocks[0].scheduleId)
        }

        const schedules: Schedule[] = data.schedules[0] // Assuming single-level array based on provided data
        await db.put(SCHEDULE_STORE, schedules, 'schedules')

        const notes: Note[] = data.notes
        for (const note of notes) {
            await db.put(NOTE_STORE, note, note.id)
        }

        if (data.rotatorValue !== undefined) {
            await db.put(ROTATOR_STORE, data.rotatorValue, ROTATOR_KEY)
        }

        console.log('Data imported successfully.')
    } catch (error) {
        console.error('Failed to import data:', error)
    }
}

export async function saveTimeBlocks(
    scheduleId: string,
    timeBlocks: TimeBlock[]
): Promise<void> {
    try {
        const db = await initDB()
        await db.put(TIME_BLOCK_STORE, timeBlocks, scheduleId)
    } catch (error) {
        console.error('Failed to save time blocks:', error)
    }
}

export async function loadTimeBlocks(scheduleId: string): Promise<TimeBlock[]> {
    try {
        const db = await initDB()
        const timeBlocks = await db.get(TIME_BLOCK_STORE, scheduleId)
        return timeBlocks || []
    } catch (error) {
        console.error('Failed to load time blocks:', error)
        return []
    }
}

export async function deleteTimeBlockById(timeBlockId: string): Promise<void> {
    try {
        const db = await initDB()

        // Retrieve all schedule keys
        const scheduleIds = await db.getAllKeys(TIME_BLOCK_STORE)

        for (const scheduleId of scheduleIds) {
            const timeBlocks = await db.get(TIME_BLOCK_STORE, scheduleId)

            if (timeBlocks) {
                // Filter out the time block with the given ID
                const updatedTimeBlocks = timeBlocks.filter(
                    block => block.id !== timeBlockId
                )

                if (updatedTimeBlocks.length !== timeBlocks.length) {
                    if (updatedTimeBlocks.length === 0) {
                        // If no time blocks remain, delete the key
                        await db.delete(TIME_BLOCK_STORE, scheduleId)
                        console.log(
                            `All time blocks removed for schedule ID ${scheduleId}. Key deleted.`
                        )
                    } else {
                        // Otherwise, update the store with the remaining time blocks
                        await db.put(
                            TIME_BLOCK_STORE,
                            updatedTimeBlocks,
                            scheduleId
                        )
                        console.log(
                            `Time block ID ${timeBlockId} removed from schedule ID ${scheduleId}.`
                        )
                    }
                    break // Exit loop once the time block is found and removed
                }
            }
        }

        // Delete associated note if it exists
        const note = await loadNoteByTimeBlockId(timeBlockId)
        if (note) {
            await deleteNoteById(note.id)
            console.log(
                `Note ID ${note.id} associated with time block ID ${timeBlockId} deleted.`
            )
        }
    } catch (error) {
        console.error('Failed to delete time block:', error)
    }
}

export async function deleteScheduleById(scheduleId: string): Promise<void> {
    try {
        const db = await initDB()
        // Load all time blocks associated with the schedule
        const timeBlocks = await loadTimeBlocks(scheduleId)
        // Log the time blocks found for debugging purposes
        console.log(
            `Deleting time blocks for schedule ID ${scheduleId}:`,
            timeBlocks
        )
        // Delete each time block and its associated notes
        for (const timeBlock of timeBlocks) {
            await deleteTimeBlockById(timeBlock.id)
        }
        // Delete the schedule itself from the store
        await db.delete(SCHEDULE_STORE, scheduleId)
        console.log(
            `Schedule ID ${scheduleId} and its time blocks deleted successfully.`
        )
    } catch (error) {
        console.error('Failed to delete schedule:', error)
    }
}

export async function saveNote(note: Note): Promise<void> {
    try {
        const db = await initDB()
        await db.put(NOTE_STORE, note, note.id)
    } catch (error) {
        console.error('Failed to save note:', error)
    }
}

export async function loadNoteByTimeBlockId(
    timeBlockId: string
): Promise<Note | null> {
    try {
        const db = await initDB()
        const allNotes = await db.getAll(NOTE_STORE)
        return allNotes.find(note => note.timeBlockId === timeBlockId) || null
    } catch (error) {
        console.error('Failed to load note:', error)
        return null
    }
}

export async function deleteNoteById(noteId: string): Promise<void> {
    try {
        const db = await initDB()
        await db.delete(NOTE_STORE, noteId)
    } catch (error) {
        console.error('Failed to delete note:', error)
    }
}

export async function saveSchedules(schedules: Schedule[]): Promise<void> {
    try {
        const db = await initDB()
        await db.put(SCHEDULE_STORE, schedules, 'schedules')
    } catch (error) {
        console.error('Failed to save schedules:', error)
    }
}

export async function loadSchedules(): Promise<Schedule[]> {
    try {
        const db = await initDB()
        return (await db.get(SCHEDULE_STORE, 'schedules')) ?? []
    } catch (error) {
        console.error('Failed to load schedules:', error)
        return []
    }
}

interface UsedColor {
    color: string
    h: number
    s: number
    l: number
}

export async function loadUsedColors(): Promise<UsedColor[]> {
    try {
        const schedules = await loadSchedules()
        return schedules
            .map(schedule => {
                if (typeof schedule.color === 'string') {
                    const match = schedule.color.match(
                        /hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/
                    )
                    if (match) {
                        const [, h, s, l] = match
                        return {
                            color: schedule.color,
                            h: parseInt(h, 10),
                            s: parseInt(s, 10),
                            l: parseInt(l, 10),
                        }
                    }
                }
                return null
            })
            .filter(color => color !== null) as UsedColor[]
    } catch (error) {
        console.error('Failed to load used colors:', error)
        return []
    }
}

export async function getRotatorValue(): Promise<number> {
    const db = await initDB()
    const value = await db.get(ROTATOR_STORE, ROTATOR_KEY)
    return value ?? 0
}

export async function setRotatorValue(value: number): Promise<void> {
    const db = await initDB()
    await db.put(ROTATOR_STORE, value, ROTATOR_KEY)
}
