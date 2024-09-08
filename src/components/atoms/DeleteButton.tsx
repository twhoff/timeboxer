import React from 'react'

interface DeleteButtonProps {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
    color: string
    isHovered: boolean
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({
    onClick,
    color,
    isHovered,
}) => (
    <button
        className="bin-icon"
        onClick={onClick}
        aria-label="Delete time block"
        style={{
            position: 'absolute',
            top: '-2px',
            right: '4px',
            width: '24px',
            height: '24px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color,
            opacity: isHovered ? 1 : 0,
        }}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            width="16"
            height="16"
            fill="currentColor"
        >
            <rect x="16" y="24" width="32" height="32" rx="2" ry="2" />
            <g className="bin-lid">
                <rect x="14" y="14" width="36" height="8" rx="1" ry="1" />
            </g>
        </svg>
    </button>
)
