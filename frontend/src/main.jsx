// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app.jsx'
import './index.css' // If you have a global style file, otherwise you can comment this out

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)