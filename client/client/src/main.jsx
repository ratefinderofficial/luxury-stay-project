import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// --- VERCEL SPEED INSIGHTS ---
// Client-side performance monitoring
import { injectSpeedInsights } from '@vercel/speed-insights'

// --- GLOBAL STYLES IMPORTS ---
// Note: Order important hai.
import './styles/theme.css'       // 1. Pehle Variables (Colors, Fonts)
import './styles/global.css'      // 2. Phir Tailwind & Reset Styles
import './styles/animations.css'  // 3. Aakhir mein Animations

// Initialize Vercel Speed Insights for performance monitoring
injectSpeedInsights()

// Application Mount Logic
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 
      Saare Providers (Auth, Theme, Socket) humne App.jsx mein lagaye hain
      taake structure clean rahe.
    */}
    <App />
  </React.StrictMode>,
)