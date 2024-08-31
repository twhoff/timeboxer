import { HEADER_HEIGHT, INTERVAL_HEIGHT } from '../constants/constants'

export const calculateBlockProps = (start: number, end: number) => {
    return {
        top: Math.min(start, end) * (INTERVAL_HEIGHT / 4) + HEADER_HEIGHT,
        height: Math.abs(end - start) * (INTERVAL_HEIGHT / 4),
    }
}
