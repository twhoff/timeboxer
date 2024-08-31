export const manageEventListener = (
    type: keyof DocumentEventMap,
    listener: EventListener,
    action: 'add' | 'remove'
) => {
    if (action === 'add') {
        document.addEventListener(type, listener)
    } else {
        document.removeEventListener(type, listener)
    }
}
