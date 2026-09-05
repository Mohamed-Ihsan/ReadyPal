import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom"

import Navbar from "./components/Navbar"
import MarketingWebsite from "./screens/MarketingWebsite"
import AuthOnboarding from "./screens/AuthOnboarding"
import ClientDashboard from "./screens/ClientDashboard"
import CareAgentOnboarding from "./screens/CareAgentOnboarding"
import BrowseJobs from "./screens/BrowseJobs"
import CareAgentDashboard from "./screens/CareAgentDashboard"
import AgentProfileMgmt from "./screens/AgentProfileMgmt"
import TaskManagement from "./screens/TaskManagement"
import CareExecution from "./screens/CareExecution"
import AgentEarnings from "./screens/AgentEarnings"
import JobManagement from "./screens/JobManagement"
import MessagingHub from "./screens/MessagingHub"

import UserManagement from "./screens/UserManagement"
import TrustCenter from "./screens/TrustCenter"
import DevLogin from "./screens/DevLogin"
import ReviewsFeedback from "./screens/ReviewsFeedback"
import PaymentsBilling from "./screens/PaymentsBilling"
import SupportCenter from "./screens/SupportCenter"
import SuperAdminPlatform from "./screens/SuperAdminPlatform"
import OperationsCenter from "./screens/OperationsCenter"
import FinanceDashboard from "./screens/FinanceDashboard"
import AdminDashboard from "./screens/AdminDashboard"

import CareAgentsBrowse from "./screens/CareAgentsBrowse"
import CareAgentProfile from "./screens/CareAgentProfile"
import CareRequestWizard from "./screens/CareRequestWizard"
import HiringNegotiation from "./screens/HiringNegotiation"
import BeneficiaryManagement from "./screens/BeneficiaryManagement"

// Renders the global Navbar once, above whichever PUBLIC route is active
// (marketing site + the login/signup flow), so it stays mounted (no
// remount/flicker) across navigation between them instead of being
// recreated inside each page. It's `position:sticky` (see Navbar.tsx), so it
// occupies real space in normal document flow at rest, pushing this
// wrapper's pages down automatically with no top padding to maintain.
//
// Deliberately scoped to just these two routes via nested routing (not a
// `useLocation()` path-match run on every render) — every dashboard, admin
// panel, wizard, and full-screen workspace route below already has its own
// complete header/sidebar chrome and a `height:'100vh'` shell tuned for
// zero navbar offset; rendering the marketing Navbar above those doubles up
// the chrome and pushes their shells past the viewport. The route tree
// itself is the single source of truth for which pages are "public" — a
// new public page joins by nesting under here, a new dashboard page by
// staying outside it, with no separate allow/deny list to keep in sync.
function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<MarketingWebsite />} />
          <Route path="/auth" element={<AuthOnboarding />} />
        </Route>

        <Route path="/dashboard" element={<ClientDashboard />} />

        <Route path="/settings" element={<Navigate to="/dashboard?tab=settings" replace />} />
        <Route path="/browse-agents" element={<CareAgentsBrowse />} />
        <Route path="/agents/:id" element={<CareAgentProfile />} />
        <Route path="/request/new" element={<CareRequestWizard />} />
        <Route path="/negotiate/:id" element={<HiringNegotiation />} />
        <Route path="/beneficiaries" element={<BeneficiaryManagement />} />

        <Route path="/agent/onboarding" element={<CareAgentOnboarding />} />
        <Route path="/agent/jobs" element={<BrowseJobs />} />
        <Route path="/agent/agentdashboard" element={<CareAgentDashboard />} />
        <Route path="/agent/agentprofilemgmt" element={<AgentProfileMgmt />} />
        <Route path="/agent/taskmanagement" element={<TaskManagement />} />
        <Route path="/agent/careexecution" element={<CareExecution />} />
        <Route path="/agent/agentearnings" element={<AgentEarnings />} />
        <Route path="/agent/jobmanagement" element={<JobManagement />} />
        <Route path="/agent/messaginghub" element={<MessagingHub />} />

        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/trust" element={<TrustCenter />} />
        <Route path="/dev-login" element={<DevLogin />} />
        <Route path="/admin/reviews" element={<ReviewsFeedback />} />
        <Route path="/admin/payments" element={<PaymentsBilling />} />
        <Route path="/admin/support" element={<SupportCenter />} />
        <Route path="/admin/platform" element={<SuperAdminPlatform />} />
        <Route path="/admin/operations" element={<OperationsCenter />} />
        <Route path="/admin/finance" element={<FinanceDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App