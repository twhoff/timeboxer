import React from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App'
import { clearData, exportData, importData } from './db'

const container = document.getElementById('root')

if (container) {
    window.exportData = exportData
    window.importData = importData
    window.clearData = clearData

    const root = createRoot(container)

    // Temporarily remove StrictMode to check for double rendering
    root.render(<App />)
} else {
    console.error('Root element not found')
}
