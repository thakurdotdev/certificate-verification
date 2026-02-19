import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import DepartmentsPage from "@/pages/faculty/DepartmentsPage";
import ManageStudentsPage from "@/pages/faculty/ManageStudentsPage";
import SubjectsPage from "@/pages/faculty/SubjectsPage";
import PendingCertificatesPage from "@/pages/faculty/PendingCertificatesPage";
import AllCertificatesPage from "@/pages/faculty/AllCertificatesPage";
import ManageFacultyPage from "@/pages/faculty/ManageFacultyPage";
import UploadCertificatePage from "@/pages/student/UploadCertificatePage";
import MyCertificatesPage from "@/pages/student/MyCertificatesPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />

              <Route path="/certificates/upload" element={<UploadCertificatePage />} />
              <Route path="/certificates" element={<MyCertificatesPage />} />

              <Route path="/certificates/pending" element={<PendingCertificatesPage />} />
              <Route path="/certificates/all" element={<AllCertificatesPage />} />
              <Route path="/students" element={<ManageStudentsPage />} />
              <Route path="/faculty" element={<ManageFacultyPage />} />
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/subjects" element={<SubjectsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
