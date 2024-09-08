import React from 'react'

interface HoverLineProps {
    top: number
    isVisible: boolean
}

export const HoverLine: React.FC<HoverLineProps> = ({ top, isVisible }) => {
    return (
        <div
            className="hover-line"
            style={{
                top: `${top}px`,
                display: isVisible ? 'block' : 'none',
            }}
        />
    )
}
