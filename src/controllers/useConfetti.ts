import { useCallback } from 'react'
import confetti from 'canvas-confetti'

export const useConfetti = () => {
    const triggerConfetti = useCallback((x: number, y: number) => {
        confetti({
            particleCount: 150,
            spread: 70,
            startVelocity: 30,
            origin: {
                x: x / window.innerWidth,
                y: y / window.innerHeight,
            },
        })
    }, [])

    return triggerConfetti
}
