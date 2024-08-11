import React from 'react'

interface TimeBlockPreviewProps {
    blockProps: {
        top: number
        height: number
        timeRange: string
        direction: string | null
    } | null
    bgColor?: string
}

const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const TimeBlockPreview: React.FC<TimeBlockPreviewProps> = ({
    blockProps,
    bgColor = '#e0e0e0',
}) => {
    if (!blockProps) return null

    const { top, height, timeRange, direction } = blockProps

    return (
        <div
            className="time-block stretching"
            style={{
                top: `${top}px`,
                height: `${height}px`,
                position: 'absolute',
                backgroundColor: hexToRgba(bgColor, 0.8), // Apply opacity
            }}
            data-testid="time-block-preview"
        >
            <div
                className="time-indicator"
                data-testid="time-block-time-indicator"
                style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    top: direction !== 'down' ? '0' : 'unset',
                    bottom: direction === 'down' ? '0' : 'unset',
                }}
            >
                {timeRange}
            </div>
        </div>
    )
}
