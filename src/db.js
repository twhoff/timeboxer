import { openDB } from 'idb'

const DB_NAME = 'TimeBlockDB'
const STORE_NAME = 'timeBlocks'

export async function initDB() {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME)
            }
        },
    })
}

export async function saveTimeBlocks(timeBlocks) {
    try {
        const db = await initDB()
        await db.put(STORE_NAME, timeBlocks, 'blocks')
        console.log('Time blocks saved successfully.')
    } catch (error) {
        console.error('Failed to save time blocks:', error)
    }
}

export async function loadTimeBlocks() {
    try {
        const db = await initDB()
        const blocks = await db.get(STORE_NAME, 'blocks')
        console.log('Time blocks loaded successfully.')
        return blocks
    } catch (error) {
        console.error('Failed to load time blocks:', error)
        return null
    }
}
