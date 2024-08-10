import React from 'react'
interface TimeBlockProps {
    top: number
    height: number
    onDelete: React.MouseEventHandler<HTMLButtonElement>
}
export const TimeBlock: React.FC<TimeBlockProps> = ({
    top,
    height,
    onDelete,
}) => (
    <div className="time-block" style={{ top, height }}>
        <button
            className="bin-icon"
            onClick={onDelete}
            aria-label="Delete time block"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                width="16"
                height="16"
                fill="#007bff"
            >
                <path d="M135.2 17.7C138.4 7.3 147.8 0 158.4 0H289.6c10.5 0 20 7.3 23.2 17.7L320 32H448c8.8 0 16 7.2 16 16s-7.2 16-16 16H432l-20.5 371.2c-1.2 21.5-19.1 38.8-40.7 38.8H76.1c-21.6 0-39.5-17.3-40.7-38.8L15 64H0c-8.8 0-16-7.2-16-16s7.2-16 16-16H128L135.2 17.7zM432 80H16L36.5 451.2c.7 12.8 11 22.8 23.6 22.8H391.9c12.6 0 22.9-10 23.6-22.8L432 80zM176 144c8.8 0 16 7.2 16 16v240c0 8.8-7.2 16-16 16s-16-7.2-16-16V160c0-8.8 7.2-16 16-16zm96 0c8.8 0 16 7.2 16 16v240c0 8.8-7.2 16-16 16s-16-7.2-16-16V160c0-8.8 7.2-16 16-16z" />
            </svg>
        </button>
    </div>
)
