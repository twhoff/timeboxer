import React from 'react'

interface TimeBlockPreviewProps {
    top: number
    height: number
    timeRange: string
    bgColor?: string
    color?: string // Ensure color prop is available
}

const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const TimeBlockPreviewComponent: React.FC<TimeBlockPreviewProps> = ({
    top,
    height,
    timeRange,
    bgColor = '#e0e0e0',
    color = '#007bff', // Default color
}) => (
    <div
        className="time-block stretching dragging"
        style={{
            top: `${top}px`,
            height: `${height}px`,
            position: 'absolute',
            backgroundColor: hexToRgba(bgColor, 0.8), // Apply opacity
            zIndex: 100,
        }}
        data-testid="time-block-preview"
    >
        <div
            className="time-indicator"
            data-testid="time-block-time-indicator"
            style={{
                backgroundColor: bgColor,
                color: color,
                borderTopColor: color,
                borderRightColor: color,
            }}
        >
            {timeRange}
        </div>
    </div>
)

export const TimeBlockPreview = React.memo(TimeBlockPreviewComponent)
