import React from 'react'
interface TimeLabelProps {
    hour: string
}
export const TimeLabel: React.FC<TimeLabelProps> = ({ hour }) => (
    <div className="time-label">{hour}</div>
)
