import { BrowserRouter, Routes, Route } from "react-router-dom"

import MarketingWebsite from "./screens/MarketingWebsite"
import AuthOnboarding from "./screens/AuthOnboarding"
import ClientDashboard from "./screens/ClientDashboard"
import AccountSettings from "./screens/AccountSettings"
import CareAgentsBrowse from "./screens/CareAgentsBrowse"
import CareAgentProfile from "./screens/CareAgentProfile"
import CareRequestWizard from "./screens/CareRequestWizard"
import HiringNegotiation from "./screens/HiringNegotiation"
import BeneficiaryManagement from "./screens/BeneficiaryManagement"
import CareAgentOnboarding from "./screens/CareAgentOnboarding"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MarketingWebsite />} />
        <Route path="/auth" element={<AuthOnboarding />} />
        <Route path="/dashboard" element={<ClientDashboard />} />
        <Route path="/settings" element={<AccountSettings />} />
        <Route path="/browse-agents" element={<CareAgentsBrowse />} />
        <Route path="/agents/:id" element={<CareAgentProfile />} />
        <Route path="/request/new" element={<CareRequestWizard />} />
        <Route path="/negotiate/:id" element={<HiringNegotiation />} />
        <Route path="/beneficiaries" element={<BeneficiaryManagement />} />

        <Route
          path="/agent/onboarding"
          element={<CareAgentOnboarding />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App