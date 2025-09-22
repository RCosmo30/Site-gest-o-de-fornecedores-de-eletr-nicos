import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from './routes' // 1. IMPORTAMOS AS ROTAS

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoutes /> {/* 2. RENDERIZAMOS AS ROTAS */}
  </StrictMode>,
)
