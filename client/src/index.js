import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.js'
import UserProvider from './context/UserProvider.js'
import CardProvider from './context/CardProvider.js'
import ReadingProvider from './context/ReadingProvider.js'
import './styles/main.css'
import './styles/burger-menu.css'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
    <BrowserRouter>
        <UserProvider>
            <CardProvider>
                <ReadingProvider>
                    <App />
                </ReadingProvider>
            </CardProvider>
        </UserProvider>
    </BrowserRouter>
)
