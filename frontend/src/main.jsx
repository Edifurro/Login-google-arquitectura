import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="412160376262-fo642cvn3g6t6r8rjn3f0l40rgocrr2g.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>,
)
