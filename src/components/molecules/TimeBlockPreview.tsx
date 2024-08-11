import React from 'react'

interface TimeBlockPreviewProps {
    blockProps: {
        top: number
        height: number
        timeRange: string
        direction: string | null
    } | null
}

export const TimeBlockPreview: React.FC<TimeBlockPreviewProps> = ({
    blockProps,
}) => {
    if (!blockProps) return null

    const { top, height, timeRange, direction } = blockProps

    return (
        <div
            className="time-block stretching" // Ensure the preview has the stretching effect
            style={{
                top: `${top}px`,
                height: `${height}px`,
                position: 'absolute',
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
