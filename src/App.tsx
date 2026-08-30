import { BrowserRouter, Routes, Route } from "react-router-dom"

import MarketingWebsite from "./screens/MarketingWebsite"
import AuthOnboarding from "./screens/AuthOnboarding"
import ClientDashboard from "./screens/ClientDashboard"
import CareAgentOnboarding from "./screens/CareAgentOnboarding"
import BrowseJobs from './screens/BrowseJobs'
import CareAgentDashboard from './screens/CareAgentDashboard'
import AgentProfileMgmt from './screens/AgentProfileMgmt'
import TaskManagement from './screens/TaskManagement'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MarketingWebsite />} />
        <Route path="/auth" element={<AuthOnboarding />} />
        <Route path="/dashboard" element={<ClientDashboard />} />
        <Route path="/agent/onboarding" element={<CareAgentOnboarding />} />
        <Route path="/agent/jobs" element={<BrowseJobs />} />
        <Route path="/agent/agentdashboard" element={<CareAgentDashboard />} />
        <Route path="/agent/agentprofilemgmt" element={<AgentProfileMgmt />} />
        <Route path="/agent/taskmanagement" element={<TaskManagement />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App