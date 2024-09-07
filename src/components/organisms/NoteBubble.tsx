import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { useTimeBlockContext } from '../../context/TimeBlockContext'
import CloudShape from '../molecules/CloudShape'

interface NoteBubbleProps {
    timeBlockId: string
    color: string
    bgColor: string
    onClose: () => void
    position: { top: number; left: number }
}

const NoteBubble: React.FC<NoteBubbleProps> = ({
    timeBlockId,
    color,
    bgColor,
    onClose,
    position,
}) => {
    const { notes, setNoteForTimeBlock } = useTimeBlockContext()
    const existingNote = notes[timeBlockId]?.content || ''
    const [content, setContent] = useState(existingNote)
    const [showTextArea, setShowTextArea] = useState(false)
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

    useEffect(() => {
        if (textAreaRef.current && showTextArea) {
            textAreaRef.current.focus()
        }
    }, [showTextArea])

    useEffect(() => {
        // Set the timeout to match the animation duration
        const timer = setTimeout(() => {
            setShowTextArea(true)
        }, 250) // 200ms is the duration of the animation

        return () => clearTimeout(timer)
    }, [])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            saveNote()
            onClose()
        } else if (e.key === 'Escape') {
            e.preventDefault()
            onClose()
        }
    }

    const saveNote = () => {
        setNoteForTimeBlock(timeBlockId, content)
    }

    return ReactDOM.createPortal(
        <>
            <div
                className="note-overlay"
                onClick={onClose}
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
                    top: position.top,
                    left: position.left,
                    zIndex: 1000,
                    width: '400px', // Adjust width as needed
                    height: '400px', // Adjust height as needed
                }}
            >
                <CloudShape
                    width={400}
                    height={400}
                    color={color}
                    bgColor={bgColor}
                />
                {showTextArea && (
                    <textarea
                        ref={textAreaRef}
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your note here..."
                        style={{
                            position: 'absolute',
                            bottom: '22%', // Adjust positioning over the cloud
                            right: '23%',
                            width: '200px',
                            height: '140px',
                            border: 'none',
                            outline: 'none',
                            backgroundColor: 'transparent',
                            color: 'inherit',
                            resize: 'none',
                            fontFamily: 'inherit',
                            fontSize: '1em',
                            lineHeight: '1.5em',
                            padding: '10px',
                        }}
                    />
                )}
            </div>
        </>,
        document.body
    )
}

export default NoteBubble
