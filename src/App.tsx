import React from 'react'
import './App.css'
import { TimeBlockProvider } from './context/TimeBlockContext'
import { ScaleColumn } from './components/molecules/ScaleColumn'
import { TimeBlockGrid } from './components/organisms/TimeBlockGrid'

const App: React.FC = () => {
    return (
        <TimeBlockProvider>
            <div className="app-container">
                <ScaleColumn />
                <TimeBlockGrid />
            </div>
        </TimeBlockProvider>
    )
}

export default App
