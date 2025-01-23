import {BrowserRouter as Router } from "react-router-dom"
import PageRoutes from "./routers/Approuter"
import "./styles/global.css"

function App() {

  return (
    <Router>
      <PageRoutes/>
    </Router>
  )
}

export default App
