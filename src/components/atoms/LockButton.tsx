import React from 'react'

interface LockButtonProps {
    isUnlocked: boolean
    isSelected: boolean
    color: string
    onClick: () => void
    isHovered: boolean
}

export const LockButton: React.FC<LockButtonProps> = ({
    isUnlocked,
    isSelected,
    color,
    onClick,
    isHovered,
}) => (
    <button
        className={`padlock-icon ${isUnlocked ? 'unlocked fadeout' : ''} ${
            isSelected ? 'hidden' : ''
        }`}
        onClick={onClick}
        aria-label="Toggle lock"
        style={{
            position: 'absolute',
            top: '-2px',
            left: '-7px',
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
            viewBox="0 0 70 70"
            width="16"
            height="16"
            fill="currentColor"
        >
            <rect x="22" y="33" width="32" height="26" rx="2" ry="2" />
            <path
                className="padlock-latch"
                d="M30 43 V23 C30 17, 46 17, 46 23 V33"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
            />
        </svg>
    </button>
)
