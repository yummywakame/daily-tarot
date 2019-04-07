import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.js'
import { BrowserRouter } from 'react-router-dom'
import UserProvider from './context/UserProvider.js'
import CardProvider from './context/CardProvider.js'
import ReadingProvider from './context/ReadingProvider.js'
import './styles/main.css'
import './styles/burger-menu.css'

ReactDOM.render(
    <BrowserRouter>
        <UserProvider>
            <CardProvider>
                <ReadingProvider>
                    <App />
                </ReadingProvider>
            </CardProvider>
        </UserProvider>
    </BrowserRouter>, document.getElementById('root')
) 