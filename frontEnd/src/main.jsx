import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { UserProvider } from './Context/UserContext'
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <UserProvider>
    <App />
    </UserProvider>
  </BrowserRouter>
)
