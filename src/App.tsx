import React from 'react'
import './App.css'
import { TimeBlockProvider } from './context/TimeBlockContext'
import { ScaleColumn } from './components/molecules/ScaleColumn'
import { TimeBlockGrid } from './components/organisms/TimeBlockGrid'
import Sidebar from './components/organisms/Sidebar'

const App: React.FC = () => {
    return (
        <TimeBlockProvider>
            <div className="app-container">
                <Sidebar />
                <ScaleColumn />
                <TimeBlockGrid />
            </div>
        </TimeBlockProvider>
    )
}

export default App
