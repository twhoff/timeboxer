import React from 'react'

interface TimeBlockProps {
    top: number
    height: number
    onDelete: React.MouseEventHandler<HTMLButtonElement>
    className?: string
    color?: string
    bgColor?: string
    opacity?: number // Prop for controlling opacity
    zIndex?: number // Prop for controlling z-index
}

const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const TimeBlock: React.FC<TimeBlockProps> = ({
    top,
    height,
    onDelete,
    className = '',
    color = '#007bff',
    bgColor = '#e0e0e0',
    opacity = 1,
    zIndex = 1,
}) => {
    return (
        <div
            data-testid="time-block"
            className={`time-block ${className}`}
            style={{
                top: `${top}px`,
                height: `${height}px`,
                backgroundColor: hexToRgba(bgColor, opacity), // Apply opacity to background
                zIndex, // Apply z-index
                position: 'absolute', // Ensure z-index is effective
            }}
        >
            <button
                className="bin-icon"
                onClick={onDelete}
                aria-label="Delete time block"
                style={{
                    backgroundColor: hexToRgba(color, opacity), // Apply opacity to button color
                    border: 'none',
                    cursor: 'pointer',
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    width="16"
                    height="16"
                    fill={bgColor}
                >
                    <path d="M135.2 17.7C138.4 7.3 147.8 0 158.4 0H289.6c10.5 0 20 7.3 23.2 17.7L320 32H448c8.8 0 16 7.2 16 16s-7.2 16-16 16H432l-20.5 371.2c-1.2 21.5-19.1 38.8-40.7 38.8H76.1c-21.6 0-39.5-17.3-40.7-38.8L15 64H0c-8.8 0-16-7.2-16-16s7.2-16 16-16H128L135.2 17.7zM432 80H16L36.5 451.2c.7 12.8 11 22.8 23.6 22.8H391.9c12.6 0 22.9-10 23.6-22.8L432 80zM176 144c8.8 0 16 7.2 16 16v240c0 8.8-7.2 16-16 16s-16-7.2-16-16V160c0-8.8 7.2-16 16-16zm96 0c8.8 0 16 7.2 16 16v240c0 8.8-7.2 16-16 16s-16-7.2-16-16V160c0-8.8 7.2-16 16-16z" />
                </svg>
            </button>
        </div>
    )
}
