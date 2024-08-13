import React, { useState, useContext, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { TimeBlockContext } from '../../context/TimeBlockContext'
import { generateADHDFriendlyColors } from '../../utils/colorGenerator'

const Sidebar: React.FC = () => {
    const {
        schedules,
        setSchedules,
        selectedSchedule,
        setSelectedSchedule,
        timeBlocks,
        setTimeBlocks,
    } = useContext(TimeBlockContext)!
    const [newScheduleName, setNewScheduleName] = useState('')
    const [showAll, setShowAll] = useState(false)
    const [contextMenu, setContextMenu] = useState<{
        id: string
        x: number
        y: number
    } | null>(null)
    const [confirmDelete, setConfirmDelete] = useState<{
        id: string
        name: string
    } | null>(null)

    useEffect(() => {
        document.documentElement.style.setProperty(
            '--show-button-opacity',
            schedules.length >= 3 ? '1' : '0'
        )
    }, [schedules])

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

    const toggleAllSchedules = () => {
        const allActive = schedules.every(schedule => schedule.isActive)
        setSchedules(
            schedules.map(schedule => ({
                ...schedule,
                isActive: !allActive,
            }))
        )
        setShowAll(!allActive)
    }

    const handleRightClick = (event: React.MouseEvent, id: string) => {
        event.preventDefault()
        setContextMenu({ id, x: event.clientX, y: event.clientY })
    }

    const handleDeleteSchedule = (id: string, name: string) => {
        setConfirmDelete({ id, name })
        setContextMenu(null)
    }

    const confirmDeleteSchedule = (id: string) => {
        setSchedules(schedules.filter(schedule => schedule.id !== id))
        const updatedTimeBlocks = { ...timeBlocks }
        delete updatedTimeBlocks[id]
        setTimeBlocks(updatedTimeBlocks)
        setConfirmDelete(null)
    }

    return (
        <div className="sidebar" onClick={() => setContextMenu(null)}>
            <h2>Schedules</h2>
            <div className="toggle-all-container">
                <button className="toggle-all" onClick={toggleAllSchedules}>
                    {showAll ? 'Clear all' : 'Show all'}
                </button>
            </div>
            <ul>
                {schedules.map(schedule => (
                    <li
                        key={schedule.id}
                        className={`schedule-item ${
                            selectedSchedule === schedule.id ? 'selected' : ''
                        }`}
                        onClick={() => toggleSelectedSchedule(schedule.id)}
                        onContextMenu={e => handleRightClick(e, schedule.id)}
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
                                backgroundColor:
                                    selectedSchedule === schedule.id
                                        ? schedule.bgColor
                                        : schedule.color,
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
            {contextMenu && (
                <div
                    className="context-menu"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <button
                        onClick={() =>
                            handleDeleteSchedule(
                                contextMenu.id,
                                schedules.find(s => s.id === contextMenu.id)
                                    ?.name || ''
                            )
                        }
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 64 64"
                            width="16"
                            height="16"
                            fill="#555" /* Darker grey for the icon */
                        >
                            <rect
                                x="16"
                                y="24"
                                width="32"
                                height="32"
                                rx="2"
                                ry="2"
                            />
                            <g className="bin-lid">
                                <rect
                                    x="14"
                                    y="14"
                                    width="36"
                                    height="8"
                                    rx="1"
                                    ry="1"
                                />
                            </g>
                        </svg>
                        Delete schedule
                    </button>
                </div>
            )}
            {confirmDelete && (
                <div className="confirmation-dialog">
                    <p>
                        Are you sure you wish to delete the schedule "
                        {confirmDelete.name}"?
                    </p>
                    <button
                        onClick={() => confirmDeleteSchedule(confirmDelete.id)}
                    >
                        Yes
                    </button>
                    <button onClick={() => setConfirmDelete(null)}>No</button>
                </div>
            )}
        </div>
    )
}

export default Sidebar
