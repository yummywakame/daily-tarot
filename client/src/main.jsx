import './apiSetup.js'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import UserProvider from './context/UserProvider.jsx'
import CardProvider from './context/CardProvider.jsx'
import ReadingProvider from './context/ReadingProvider.jsx'
import './styles/main.css'
import './styles/burger-menu.css'

const container = document.getElementById('root')
const root = createRoot(container)

const basename = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || undefined

root.render(
    <BrowserRouter basename={basename}>
        <UserProvider>
            <CardProvider>
                <ReadingProvider>
                    <App />
                </ReadingProvider>
            </CardProvider>
        </UserProvider>
    </BrowserRouter>
)
