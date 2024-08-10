import { openDB, IDBPDatabase, DBSchema } from 'idb'

const DB_NAME = 'TimeBlockDB'
const STORE_NAME = 'timeBlocks'

interface TimeBlockDB extends DBSchema {
    [STORE_NAME]: {
        key: string
        value: Record<number, Array<{ start: number; end: number }>>
    }
}

export async function initDB(): Promise<IDBPDatabase<TimeBlockDB>> {
    return openDB<TimeBlockDB>(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME)
            }
        },
    })
}

export async function saveTimeBlocks(
    timeBlocks: Record<number, Array<{ start: number; end: number }>>
): Promise<void> {
    try {
        const db = await initDB()
        await db.put(STORE_NAME, timeBlocks, 'blocks')
    } catch (error) {
        console.error('Failed to save time blocks:', error)
    }
}

export async function loadTimeBlocks(): Promise<Record<
    number,
    Array<{ start: number; end: number }>
> | null> {
    try {
        const db = await initDB()
        return (await db.get(STORE_NAME, 'blocks')) ?? null
    } catch (error) {
        console.error('Failed to load time blocks:', error)
        return null
    }
}
