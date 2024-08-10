// src/controllers/useConfetti.ts
import confetti from 'canvas-confetti'

export const useConfetti = (x: number, y: number) => {
    confetti({
        particleCount: 150,
        spread: 70,
        startVelocity: 30,
        origin: {
            x: x / window.innerWidth,
            y: y / window.innerHeight,
        },
    })
}
