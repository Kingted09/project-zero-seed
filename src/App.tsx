
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Alerts from './pages/Alerts';
import Resources from './pages/Resources';
import ResourceDetail from './pages/Resources/ResourceDetail';
import AppLayout from './components/layout/AppLayout';
import NotFound from './pages/NotFound';
import AuthRequired from './components/auth/AuthRequired';
import GuestOnly from './components/auth/GuestOnly';
import ResetPassword from './pages/ResetPassword';
import OnboardingFlow from './pages/OnboardingFlow';
import NearbyResources from './pages/NearbyResources';
import Settings from './pages/Settings';
import ReportIncident from './pages/ReportIncident';
import EmergencyContacts from './pages/profile/EmergencyContacts';
import MedicalInfo from './pages/profile/MedicalInfo';
import DefaultContacts from './pages/contacts/DefaultContacts';

function App() {
  return (
    <>
      <Routes>
        {/* Guest routes */}
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route element={<GuestOnly />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Protected routes */}
        <Route element={<AuthRequired />}>
          <Route path="/onboarding" element={<OnboardingFlow />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/emergency-contacts" element={<EmergencyContacts />} />
            <Route path="profile/medical" element={<MedicalInfo />} />
            <Route path="resources" element={<Resources />} />
            <Route path="resources/:id" element={<ResourceDetail />} />
            <Route path="nearby" element={<NearbyResources />} />
            <Route path="contacts" element={<DefaultContacts />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="/app/report" element={<ReportIncident />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-center" richColors />
    </>
  );
}

export default App;
