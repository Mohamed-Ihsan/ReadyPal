import { BrowserRouter, Routes, Route } from "react-router-dom"
import MarketingWebsite from "./screens/MarketingWebsite"
import AuthOnboarding from "./screens/AuthOnboarding"
import ClientDashboard from "./screens/ClientDashboard"
import CareAgentOnboarding from "./screens/CareAgentOnboarding"
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MarketingWebsite />} />
        <Route path="/auth" element={<AuthOnboarding />} />
        <Route path="/dashboard" element={<ClientDashboard />} />

        <Route
          path="/agent/onboarding"
          element={<CareAgentOnboarding />}
        />
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