import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { useTimeBlockContext } from '../../context/TimeBlockContext'

interface NoteBubbleProps {
    timeBlockId: string
    color: string
    bgColor: string
    onClose: () => void
    bubblePosition: { top: number; left: number }
}

const NoteBubble: React.FC<NoteBubbleProps> = ({
    timeBlockId,
    color,
    bgColor,
    onClose,
    bubblePosition,
}) => {
    const { notes, setNoteForTimeBlock } = useTimeBlockContext()
    const existingNote = notes[timeBlockId]?.content || ''
    const [content, setContent] = useState(existingNote)
    const [showTextArea, setShowTextArea] = useState(false)
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

    const [isLeftAligned, setIsLeftAligned] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const viewportWidth = window.innerWidth
        setIsLeftAligned(bubblePosition.left + 300 > viewportWidth)
    }, [bubblePosition])

    useEffect(() => {
        if (textAreaRef.current && showTextArea) {
            textAreaRef.current.focus()
        }
    }, [showTextArea])

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowTextArea(true)
            setIsVisible(true)
        }, 250)

        return () => clearTimeout(timer)
    }, [])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            saveNote()
            setIsVisible(false)
            setTimeout(onClose, 300)
        } else if (e.key === 'Escape') {
            e.preventDefault()
            setIsVisible(false)
            setTimeout(onClose, 300)
        }
    }

    const saveNote = () => {
        setNoteForTimeBlock(timeBlockId, content)
    }

    return ReactDOM.createPortal(
        <>
            <div
                className="note-overlay"
                onClick={() => {
                    setIsVisible(false)
                    setTimeout(onClose, 300)
                }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'transparent',
                    zIndex: 999,
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    top: bubblePosition.top,
                    left: isLeftAligned
                        ? bubblePosition.left - 320
                        : bubblePosition.left + 20,
                    zIndex: 1000,
                    width: '300px',
                    backgroundColor: bgColor,
                    border: `1px solid ${color}`,
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    padding: '10px',
                    backgroundImage: `linear-gradient(to bottom, transparent, transparent 16px, ${color}33 17px)`,
                    backgroundSize: '100% 17px', // Closer lines
                    boxSizing: 'border-box',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible
                        ? 'translateY(0)'
                        : 'translateY(-10px)',
                    transition: 'opacity 0.3s ease, transform 0.3s ease',
                }}
            >
                {showTextArea && (
                    <textarea
                        ref={textAreaRef}
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your note here..."
                        style={{
                            width: '100%',
                            height: '120px',
                            border: 'none',
                            outline: 'none',
                            backgroundColor: 'transparent',
                            color: 'inherit',
                            resize: 'none',
                            fontFamily: 'inherit',
                            fontSize: '0.9em',
                            lineHeight: '1.2em',
                            padding: '6px 10px 10px 10px',
                            boxSizing: 'border-box',
                        }}
                    />
                )}
            </div>
        </>,
        document.body
    )
}

export default NoteBubble
