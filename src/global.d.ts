interface Window {
    exportData: () => Promise<void>
    importData: (jsonData: string) => Promise<void>
    clearData: () => Promise<void>
}
