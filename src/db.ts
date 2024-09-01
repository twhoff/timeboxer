import { openDB, IDBPDatabase, DBSchema } from 'idb'
const DB_NAME = 'TimeBlockDB'
const TIME_BLOCK_STORE = 'timeBlocks'
const SCHEDULE_STORE = 'schedules'
const ROTATOR_STORE = 'colorGeneratorRotatorValueStore'
const ROTATOR_KEY = 'colorGeneratorRotatorValue'
export interface TimeBlock {
    id: string
    scheduleId: string
    dayIndex: number
    start: number
    end: number
    color: string
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
    return openDB<TimeBlockDB>(DB_NAME, 3, {
        // Updated version number
        upgrade(db) {
            if (!db.objectStoreNames.contains(TIME_BLOCK_STORE)) {
                db.createObjectStore(TIME_BLOCK_STORE)
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
    color: string // Store the original color string
    h: number
    s: number
    l: number
}

export async function loadUsedColors(): Promise<UsedColor[]> {
    try {
        const schedules = await loadSchedules()
        // Extract HSL values and include the original color string
        return schedules
            .map(schedule => {
                if (typeof schedule.color === 'string') {
                    const match = schedule.color.match(
                        /hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/
                    )
                    if (match) {
                        const [, h, s, l] = match
                        return {
                            color: schedule.color, // Include the original color string
                            h: parseInt(h, 10),
                            s: parseInt(s, 10),
                            l: parseInt(l, 10),
                        }
                    }
                }
                return null // Return null for undefined or improperly formatted colors
            })
            .filter(color => color !== null) as UsedColor[] // Filter out nulls
    } catch (error) {
        console.error('Failed to load used colors:', error)
        return []
    }
}

// Function to get the rotator value
export async function getRotatorValue(): Promise<number> {
    const db = await initDB()
    const value = await db.get(ROTATOR_STORE, ROTATOR_KEY)
    return value ?? 0 // Default to 0 if not found
}
// Function to set the rotator value
export async function setRotatorValue(value: number): Promise<void> {
    const db = await initDB()
    await db.put(ROTATOR_STORE, value, ROTATOR_KEY)
}
