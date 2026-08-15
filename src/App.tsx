import { BrowserRouter, Routes, Route } from "react-router-dom"
import MarketingWebsite from "./screens/MarketingWebsite"
import AuthOnboarding from "./screens/AuthOnboarding"
import ClientDashboard from "./screens/ClientDashboard"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MarketingWebsite />} />
        <Route path="/auth" element={<AuthOnboarding />} />
        <Route path="/dashboard" element={<ClientDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App