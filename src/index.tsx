import React from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App'

const container = document.getElementById('root')

if (container) {
    const root = createRoot(container)

    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    )
} else {
    // Handle the error case where the container is not found
    console.error('Root element not found')
}
