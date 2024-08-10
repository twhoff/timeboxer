import { openDB, IDBPDatabase, DBSchema } from 'idb'

const DB_NAME = 'TimeBlockDB'
const STORE_NAME = 'timeBlocks'

// Define the database schema
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

export async function saveTimeBlocks(timeBlocks: TimeBlockDB[typeof STORE_NAME]['value']): Promise<void> {
    try {
        const db = await initDB()
        await db.put(STORE_NAME, timeBlocks, 'blocks')
        console.log('Time blocks saved successfully.')
    } catch (error) {
        console.error('Failed to save time blocks:', error)
    }
}

export async function loadTimeBlocks(): Promise<TimeBlockDB[typeof STORE_NAME]['value'] | null> {
    try {
        const db = await initDB()
        const blocks = (await db.get(STORE_NAME, 'blocks')) ?? null // Use nullish coalescing to default to null
        console.log('Time blocks loaded successfully.')
        return blocks
    } catch (error) {
        console.error('Failed to load time blocks:', error)
        return null
    }
}
