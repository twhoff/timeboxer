import React, { useState, useContext } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { TimeBlockContext } from '../../context/TimeBlockContext'
import { generateADHDFriendlyColors } from '../../utils/colorGenerator'

const Sidebar: React.FC = () => {
    const { schedules, setSchedules, selectedSchedule, setSelectedSchedule } =
        useContext(TimeBlockContext)!
    const [newScheduleName, setNewScheduleName] = useState('')

    const addSchedule = async () => {
        if (newScheduleName.trim() === '') return

        const { color, bgColor } = await generateADHDFriendlyColors()

        const newSchedule = {
            id: uuidv4(),
            name: newScheduleName,
            isActive: false,
            color,
            bgColor,
        }

        setSchedules([...schedules, newSchedule])
        setNewScheduleName('')
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            addSchedule()
        }
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

    const toggleSelectedSchedule = (id: string) => {
        if (selectedSchedule === id) {
            setSelectedSchedule(null)
        } else {
            setSelectedSchedule(id)
        }
    }

    return (
        <div className="sidebar">
            <h2>Schedules</h2>
            <ul>
                {schedules.map(schedule => (
                    <li
                        key={schedule.id}
                        className={`schedule-item ${
                            selectedSchedule === schedule.id ? 'selected' : ''
                        }`}
                        onClick={() => toggleSelectedSchedule(schedule.id)}
                        style={{
                            backgroundColor:
                                selectedSchedule === schedule.id
                                    ? schedule.bgColor
                                    : 'transparent',
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={schedule.isActive}
                            onChange={() =>
                                toggleScheduleActivation(schedule.id)
                            }
                            onClick={e => e.stopPropagation()}
                        />
                        <div
                            className="color-square"
                            style={{
                                backgroundColor: schedule.bgColor,
                            }}
                        />
                        <button
                            style={{
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                marginLeft: '0.5rem',
                                flexGrow: 1,
                                textAlign: 'left',
                                color:
                                    selectedSchedule === schedule.id
                                        ? schedule.color
                                        : 'inherit',
                                zIndex:
                                    selectedSchedule === schedule.id ? 1 : 0,
                            }}
                        >
                            {schedule.name}
                        </button>
                    </li>
                ))}
            </ul>
            <div className="add-schedule">
                <input
                    type="text"
                    value={newScheduleName}
                    onChange={e => setNewScheduleName(e.target.value)}
                    onKeyPress={handleKeyPress}
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
