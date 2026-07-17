import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // HashRouter: packaged Electron builds load the renderer via file://,
  // where BrowserRouter paths don't resolve.
  <HashRouter>
    <App />
  </HashRouter>
)
