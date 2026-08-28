import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const container = document.getElementById('root');
const root = container.__reactRoot || createRoot(container);
container.__reactRoot = root;

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
