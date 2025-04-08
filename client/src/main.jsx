import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { persistor, store } from './store'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { PersistGate } from 'redux-persist/integration/react'
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <Provider store={store}>
  <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
  <ToastContainer/>
    <App />
    </PersistGate>
  </Provider>
  </StrictMode>,
)
