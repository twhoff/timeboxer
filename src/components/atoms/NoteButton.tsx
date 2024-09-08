import React from 'react'
import { Note } from '../../db' // Ensure the Note type is imported from the correct module

interface NoteButtonProps {
    notes: Record<string, Note | null> // Use the Note type for better type safety
    blockId: string
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
    color: string
    isHovered: boolean
    isTyping: boolean
}

export const NoteButton: React.FC<NoteButtonProps> = ({
    notes,
    blockId,
    onClick,
    color,
    isHovered,
    isTyping,
}) => (
    <button
        className="note-icon-button"
        onClick={onClick}
        aria-label="Edit time block"
        style={{
            position: 'absolute',
            top: `${notes[blockId] ? '2px' : '0'}`,
            right: '22px',
            width: `${notes[blockId] ? '18px' : '24px'}`,
            height: `${notes[blockId] ? '18px' : '24px'}`,
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color,
            opacity: isHovered ? 1 : 0,
        }}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`${notes[blockId] ? '0 0 28 28' : '0 0 64 64'}`}
            width={`${notes[blockId] ? 14 : 16}`}
            height={`${notes[blockId] ? 14 : 16}`}
            className={`note-icon-svg ${
                notes[blockId] ? 'note-icon' : 'mechanical-pencil'
            } ${!notes[blockId] && isTyping ? 'wiggle' : ''}`}
        >
            {notes[blockId] ? (
                <>
                    <path
                        d="M8 10.25C8 9.83579 8.33579 9.5 8.75 9.5H18.75C19.1642 9.5 19.5 9.83579 19.5 10.25C19.5 10.6642 19.1642 11 18.75 11H8.75C8.33579 11 8 10.6642 8 10.25Z"
                        fill="currentColor"
                    />
                    <path
                        d="M8 14.75C8 14.3358 8.33579 14 8.75 14H18.75C19.1642 14 19.5 14.3358 19.5 14.75C19.5 15.1642 19.1642 15.5 18.75 15.5H8.75C8.33579 15.5 8 15.1642 8 14.75Z"
                        fill="currentColor"
                    />
                    <path
                        d="M8.75 18.5C8.33579 18.5 8 18.8358 8 19.25C8 19.6642 8.33579 20 8.75 20H13.25C13.6642 20 14 19.6642 14 19.25C14 18.8358 13.6642 18.5 13.25 18.5H8.75Z"
                        fill="currentColor"
                    />
                    <path
                        d="M14 2C14.4142 2 14.75 2.33579 14.75 2.75V4H18.5V2.75C18.5 2.33579 18.8358 2 19.25 2C19.6642 2 20 2.33579 20 2.75V4H20.75C21.9926 4 23 5.00736 23 6.25V19.2459C23 19.4448 22.921 19.6356 22.7803 19.7762L17.2762 25.2803C17.1355 25.421 16.9447 25.5 16.7458 25.5H6.75C5.50736 25.5 4.5 24.4926 4.5 23.25V6.25C4.5 5.00736 5.50736 4 6.75 4H8V2.75C8 2.33579 8.33579 2 8.75 2C9.16421 2 9.5 2.33579 9.5 2.75V4H13.25V2.75C13.25 2.33579 13.5858 2 14 2ZM6 6.25V23.25C6 23.6642 6.33579 24 6.75 24H15.9958V20.7459C15.9958 19.5032 17.0032 18.4959 18.2458 18.4959H21.5V6.25C21.5 5.83579 21.1642 5.5 20.75 5.5H6.75C6.33579 5.5 6 5.83579 6 6.25ZM18.2458 19.9959C17.8316 19.9959 17.4958 20.3317 17.4958 20.7459V22.9394L20.4393 19.9959H18.2458Z"
                        fill="currentColor"
                    />
                </>
            ) : (
                <>
                    <rect
                        x="28"
                        y="5"
                        width="8"
                        height="8"
                        rx="2"
                        ry="2"
                        fill="currentColor"
                        className="eraser"
                    />
                    <rect
                        x="28"
                        y="16"
                        width="8"
                        height="28"
                        fill="currentColor"
                        className="shaft"
                    />
                    <path
                        d="M28 44 L32 50 L36 44 L32 47"
                        fill="currentColor"
                        className="sheathe"
                    />
                    <path
                        d="M30 47 L32 54 L34 47"
                        fill="currentColor"
                        className="tip"
                    />
                </>
            )}
        </svg>
    </button>
)
