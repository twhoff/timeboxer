import React from 'react'
import { TimeHeader } from '../atoms/TimeHeader'
import { TimeLabel } from '../atoms/TimeLabel'
const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)
export const ScaleColumn: React.FC = () => (
    <div className="scale-column">
        <TimeHeader />
        {hours.map((hour, index) => (
            <TimeLabel key={index} hour={hour} />
        ))}
    </div>
)
