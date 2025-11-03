import React from 'react'
import { createRoot } from 'react-dom/client'
import './firebase.js'; // <- Importamos para que Firebase se inicialice
import './styles.css';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
