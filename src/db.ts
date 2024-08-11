import { openDB, IDBPDatabase, DBSchema } from 'idb'
const DB_NAME = 'TimeBlockDB'
const TIME_BLOCK_STORE = 'timeBlocks'
const SCHEDULE_STORE = 'schedules'
interface TimeBlock {
    id: string
    start: number
    end: number
}
interface Schedule {
    id: string
    name: string
    isActive: boolean
}
interface TimeBlockDB extends DBSchema {
    [TIME_BLOCK_STORE]: {
        key: string
        value: Record<number, TimeBlock[]>
    }
    [SCHEDULE_STORE]: {
        key: string
        value: Schedule[]
    }
}
export async function initDB(): Promise<IDBPDatabase<TimeBlockDB>> {
    return openDB<TimeBlockDB>(DB_NAME, 2, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(TIME_BLOCK_STORE)) {
                db.createObjectStore(TIME_BLOCK_STORE)
            }
            if (!db.objectStoreNames.contains(SCHEDULE_STORE)) {
                db.createObjectStore(SCHEDULE_STORE)
            }
        },
    })
}
export async function saveSchedules(schedules: Schedule[]): Promise<void> {
    try {
        const db = await initDB()
        await db.put(SCHEDULE_STORE, schedules, 'schedules') // Save the entire Schedule object including isActive
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

export async function saveTimeBlocks(
    timeBlocks: Record<number, TimeBlock[]>
): Promise<void> {
    try {
        const db = await initDB()
        await db.put(TIME_BLOCK_STORE, timeBlocks, 'blocks')
    } catch (error) {
        console.error('Failed to save time blocks:', error)
    }
}

export async function loadTimeBlocks(): Promise<Record<
    number,
    TimeBlock[]
> | null> {
    try {
        const db = await initDB()
        return (await db.get(TIME_BLOCK_STORE, 'blocks')) ?? null
    } catch (error) {
        console.error('Failed to load time blocks:', error)
        return null
    }
}
