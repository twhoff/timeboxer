// src/components/organisms/Sidebar.tsx
import React, { useState, useContext } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { TimeBlockContext } from '../../context/TimeBlockContext'

const Sidebar: React.FC = () => {
    const { schedules, setSchedules } = useContext(TimeBlockContext)!
    const [newScheduleName, setNewScheduleName] = useState('')

    const addSchedule = () => {
        if (newScheduleName.trim() === '') return

        const newSchedule = {
            id: uuidv4(),
            name: newScheduleName,
            isActive: false, // Default to not active
        }

        setSchedules([...schedules, newSchedule])
        setNewScheduleName('') // Clear the input after adding
    }

    const toggleScheduleActivation = (id: string) => {
        setSchedules(
            schedules.map(schedule =>
                schedule.id === id
                    ? { ...schedule, isActive: !schedule.isActive }
                    : schedule
            )
        )
    }

    return (
        <div className="sidebar">
            <h2>Schedules</h2>
            <ul>
                {schedules.map(schedule => (
                    <li key={schedule.id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={schedule.isActive} // Use isActive to determine checkbox state
                                onChange={() =>
                                    toggleScheduleActivation(schedule.id)
                                }
                            />
                            {schedule.name}
                        </label>
                    </li>
                ))}
            </ul>
            <div className="add-schedule">
                <input
                    type="text"
                    value={newScheduleName}
                    onChange={e => setNewScheduleName(e.target.value)}
                    placeholder="Add new schedule"
                />
                <button onClick={addSchedule}>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M8 1V15M1 8H15"
                            stroke="black"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default Sidebar
